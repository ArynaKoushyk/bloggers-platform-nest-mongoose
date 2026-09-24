import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, type LikeModelType } from '../../domain/like.entity';
import { LikeTargetType } from '../../domain/enums/like-target-type.enum';
import { LikeStatus } from '../../domain/enums/like-status.enum';
import { LikeDetailsViewDto } from '../../api/view-dto/like-details.view-dto';

type LikeDetailsReadModel = Pick<
  Like,
  'createdAt' | 'authorId' | 'authorLogin'
>;

@Injectable()
export class LikesQueryRepository {
  constructor(
    @InjectModel(Like.name)
    private readonly likeModel: LikeModelType,
  ) {}

  async findStatusByAuthorAndTarget(
    targetId: string,
    targetType: LikeTargetType,
    authorId: string,
  ): Promise<LikeStatus> {
    const like = await this.likeModel
      .findOne({
        targetId,
        targetType,
        authorId,
      })
      .lean()
      .exec();

    if (!like) {
      return LikeStatus.None;
    }
    return like.status;
  }

  async findStatusesByAuthorAndTargets(
    targetIds: string[],
    targetType: LikeTargetType,
    authorId: string,
  ): Promise<Map<string, LikeStatus>> {
    const statuses = new Map<string, LikeStatus>();

    for (const targetId of targetIds) {
      statuses.set(targetId, LikeStatus.None);
    }

    if (targetIds.length === 0) {
      return statuses;
    }

    const likes = await this.likeModel
      .find({
        targetId: { $in: targetIds },
        targetType,
        authorId,
      })
      .lean()
      .exec();

    for (const like of likes) {
      statuses.set(like.targetId, like.status);
    }

    return statuses;
  }

  async findLatestLikesForSingleTarget(
    targetId: string,
    targetType: LikeTargetType,
  ): Promise<LikeDetailsViewDto[]> {
    const likes = await this.likeModel
      .find({
        targetId,
        targetType,
        status: LikeStatus.Like,
      })
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(3)
      .lean()
      .exec();

    return likes.map((like) => this.mapToLikeDetails(like));
  }

  async findLatestLikesForMultipleTargets(
    targetIds: string[],
    targetType: LikeTargetType,
  ): Promise<Map<string, LikeDetailsViewDto[]>> {
    const latestLikesEntries = await Promise.all(
      targetIds.map(async (targetId) => {
        const latestLikes = await this.findLatestLikesForSingleTarget(
          targetId,
          targetType,
        );

        return [targetId, latestLikes] as const;
      }),
    );

    return new Map(latestLikesEntries);
  }

  private mapToLikeDetails(like: LikeDetailsReadModel): LikeDetailsViewDto {
    return {
      addedAt: like.createdAt,
      userId: like.authorId,
      login: like.authorLogin,
    };
  }
}
