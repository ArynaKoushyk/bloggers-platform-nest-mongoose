import { PostsRepository } from '../../infrastructure/repositories/posts.repository';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeletePostCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostCommand): Promise<void> {
    const post = await this.postsRepository.findByIdOrFail(id);
    post.markAsDeleted();
    await this.postsRepository.save(post);
  }
}
