import { UsersRepository } from '../../infrastructure/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { Command, ICommandHandler } from '@nestjs/cqrs';
import { UsersFactory } from '../factories/users.factory';

export class CreateUserCommand extends Command<string> {
  constructor(public readonly dto: CreateUserDto) {
    super();
  }
}

export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersFactory: UsersFactory,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<string> {
    const user = await this.usersFactory.createConfirmed(dto);

    await this.usersRepository.save(user);

    return user._id.toString();
  }
}
