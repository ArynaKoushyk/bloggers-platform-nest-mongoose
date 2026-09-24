import { PaginatedViewDto } from '../../../../../core/dto/base-paginated.view-dto';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts.query-repository';
import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/repositories/blogs.query-repository';

export class GetBlogPostsQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
  constructor(
    public readonly blogId: string,
    public readonly queryParams: GetPostsQueryParams,
  ) {
    super();
  }
}

@QueryHandler(GetBlogPostsQuery)
export class GetBlogPostsQueryHandler implements IQueryHandler<GetBlogPostsQuery> {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async execute({
    queryParams,
    blogId,
  }: GetBlogPostsQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsQueryRepository.findByIdOrFail(blogId);

    return this.postsQueryRepository.findAllByBlogId(blogId, queryParams);
  }
}
