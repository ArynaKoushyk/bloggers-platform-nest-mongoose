import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';

export class GetCommentByIdQuery extends Query<CommentViewDto> {
  constructor(public readonly commentId: string) {
    super();
  }
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  execute({ commentId }: GetCommentByIdQuery): Promise<CommentViewDto> {
    return this.commentsQueryRepository.findByIdOrFail(commentId);
  }
}
