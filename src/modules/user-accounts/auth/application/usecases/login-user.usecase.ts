import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtAdapter } from '../../infrastructure/adapters/jwt.adapter';

export class LoginCommand extends Command<{ accessToken: string }> {
  constructor(public readonly userId: string) {
    super();
  }
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(private readonly jwtAdapter: JwtAdapter) {}

  async execute({ userId }: LoginCommand): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtAdapter.createAccessToken(userId);
    return {
      accessToken: accessToken,
    };
  }
}
