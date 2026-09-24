import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts.query-repository';

export class GetPostByIdQuery extends Query<PostViewDto> {
  constructor(public readonly postId: string) {
    super();
  }
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  execute({ postId }: GetPostByIdQuery): Promise<PostViewDto> {
    return this.postsQueryRepository.findByIdOrFail(postId);
  }
}
