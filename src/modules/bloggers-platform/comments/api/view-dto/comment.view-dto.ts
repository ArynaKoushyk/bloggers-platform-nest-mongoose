import type { Types } from 'mongoose';
import { LikesInfoViewDto } from '../../../likes/api/view-dto/likes-info.view-dto';
import { LikeStatus } from '../../../likes/domain/enums/like-status.enum';
import type { Comment } from '../../domain/comment.entity';

type CommentReadModel = Pick<
  Comment,
  'content' | 'commentatorInfo' | 'createdAt' | 'likesCount' | 'dislikesCount'
> & {
  _id: Types.ObjectId;
};

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: LikesInfoViewDto;

  static mapToView(comment: CommentReadModel): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    };
    dto.createdAt = comment.createdAt;
    dto.likesInfo = {
      likesCount: comment.likesCount ?? 0,
      dislikesCount: comment.dislikesCount ?? 0,
      myStatus: LikeStatus.None,
    };

    return dto;
  }
}
