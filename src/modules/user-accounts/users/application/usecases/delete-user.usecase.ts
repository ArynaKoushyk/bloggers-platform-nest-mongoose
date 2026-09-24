import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';

export class DeleteUserCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    const user = await this.usersRepository.findByIdOrFail(id);
    user.markAsDeleted();
    await this.usersRepository.save(user);
  }
}
