import { Post, type PostModelType } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreatePostDomainDto } from '../../domain/dto/create-post.domain.dto';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostCommand extends Command<string> {
  constructor(public readonly dto: CreatePostDto) {
    super();
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: PostModelType,
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<string> {
    const { title, shortDescription, content, blogId } = dto;

    const blog = await this.blogsRepository.findByIdOrFail(blogId);

    const domainDto: CreatePostDomainDto = {
      title,
      shortDescription,
      content,
      blogId: blog._id.toString(),
      blogName: blog.name,
    };

    const createdPost = this.postModel.createInstance(domainDto);

    await this.postsRepository.save(createdPost);

    return createdPost._id.toString();
  }
}
