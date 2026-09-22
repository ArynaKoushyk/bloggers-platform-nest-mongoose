import { RegisterUserDto } from '../dto/register-user.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersFactory } from '../../../users/application/factories/users.factory';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegisterUserCommand extends Command<void> {
  constructor(public readonly dto: RegisterUserDto) {
    super();
  }
}
@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private readonly usersFactory: UsersFactory,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    const user = await this.usersFactory.createConfirmed(dto);

    await this.usersRepository.save(user);
  }
}
