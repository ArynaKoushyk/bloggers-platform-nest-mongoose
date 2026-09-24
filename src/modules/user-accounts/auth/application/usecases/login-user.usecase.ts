import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../infrastructure/adapters/jwt.adapter';

export class LoginUserCommand extends Command<{ accessToken: string }> {
  constructor(public readonly userId: string) {
    super();
  }
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(private readonly jwtAdapter: JwtAdapter) {}

  async execute({
    userId,
  }: LoginUserCommand): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtAdapter.createAccessToken(userId);
    return {
      accessToken: accessToken,
    };
  }
}
