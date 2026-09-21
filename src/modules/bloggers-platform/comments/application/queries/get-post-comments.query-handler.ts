import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base-paginated.view-dto';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { GetCommentsQueryParams } from '../../api/input-dto/get-comments-query-params.input-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';
import { PostsQueryRepository } from '../../../posts/infrastructure/query/posts.query-repository';

export class GetPostCommentsQuery extends Query<
  PaginatedViewDto<CommentViewDto[]>
> {
  constructor(
    public readonly postId: string,
    public readonly queryParams: GetCommentsQueryParams,
  ) {
    super();
  }
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsQueryHandler implements IQueryHandler<GetPostCommentsQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute({
    postId,
    queryParams,
  }: GetPostCommentsQuery): Promise<PaginatedViewDto<CommentViewDto[]>> {
    await this.postsQueryRepository.findByIdOrFail(postId);

    return await this.commentsQueryRepository.findAllByPostId(
      postId,
      queryParams,
    );
  }
}
