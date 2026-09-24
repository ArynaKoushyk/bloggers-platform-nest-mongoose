import { BlogsRepository } from '../../infrastructure/repositories/blogs.repository';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { UpdateBlogDomainDto } from '../../domain/dto/update-blog.domain.dto';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateBlogCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateBlogDto,
  ) {
    super();
  }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findByIdOrFail(id);
    const domainDto: UpdateBlogDomainDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };
    blog.update(domainDto);
    await this.blogsRepository.save(blog);
  }
}
