import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';

export class GetBlogByIdQuery extends Query<BlogViewDto> {
  constructor(public readonly blogId: string) {
    super();
  }
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler implements IQueryHandler<GetBlogByIdQuery> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  execute({ blogId }: GetBlogByIdQuery): Promise<BlogViewDto> {
    return this.blogsQueryRepository.findByIdOrFail(blogId);
  }
}
