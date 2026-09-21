import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteBlogCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findByIdOrFail(command.id);
    blog.markAsDeleted();
    await this.blogsRepository.save(blog);
  }
}
