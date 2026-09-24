import { PostsRepository } from '../../infrastructure/repositories/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/repositories/blogs.repository';
import { UpdatePostDto } from '../dto/update-post.dto';
import { UpdatePostDomainDto } from '../../domain/dto/update-post.domain.dto';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdatePostCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly dto: UpdatePostDto,
  ) {
    super();
  }
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute({ id, dto }: UpdatePostCommand): Promise<void> {
    const post = await this.postsRepository.findByIdOrFail(id);

    const { title, shortDescription, content, blogId } = dto;

    const blog = await this.blogsRepository.findByIdOrFail(blogId);

    const domainDto: UpdatePostDomainDto = {
      title,
      shortDescription,
      content,
      blogId: blog._id.toString(),
      blogName: blog.name,
    };

    post.update(domainDto);

    await this.postsRepository.save(post);
  }
}
