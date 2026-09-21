import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../core/dto/base-paginated.view-dto';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { GetPostsQueryParams } from '../../api/input-dto/get-posts-query-params.input-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts.query-repository';

export class GetPostsQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
  constructor(public readonly queryParams: GetPostsQueryParams) {
    super();
  }
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  execute({
    queryParams,
  }: GetPostsQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.findAll(queryParams);
  }
}
