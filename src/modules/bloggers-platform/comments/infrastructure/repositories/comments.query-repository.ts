import { Injectable } from '@nestjs/common';
import { GetCommentsQueryParams } from '../../api/input-dto/get-comments-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base-paginated.view-dto';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../../domain/comment.entity';
import { DomainException } from '../../../../../core/exceptions/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-code.enum';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
  ) {}

  async findAllByPostId(
    postId: string,
    query: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip = query.calculateSkip();
    const limit = pageSize;
    const filter: FilterQuery<Comment> = { postId, deletedAt: null };

    const comments = await this.commentModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalCount = await this.commentModel.countDocuments(filter).exec();
    const items = comments.map((comment) => CommentViewDto.mapToView(comment));
    return PaginatedViewDto.mapToView({
      items,
      page: pageNumber,
      size: pageSize,
      totalCount,
    });
  }
  async findByIdOrFail(id: string): Promise<CommentViewDto> {
    const comment = await this.commentModel
      .findOne({
        _id: id,
        deletedAt: null,
      })
      .lean()
      .exec();

    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Comment not found ',
      });
    }
    return CommentViewDto.mapToView(comment);
  }
}
