import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { GetBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';
import { PaginatedViewDto } from '../../../../../core/dto/base-paginated.view-dto';

export class GetBlogsQuery extends Query<PaginatedViewDto<BlogViewDto[]>> {
  constructor(public readonly queryParams: GetBlogsQueryParams) {
    super();
  }
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  execute(query: GetBlogsQuery): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const { queryParams } = query;
    return this.blogsQueryRepository.findAll(queryParams);
  }
}
