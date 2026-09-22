import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { StartPasswordRecoveryDto } from '../dto/start-password-recovery.dto';
import { randomUUID } from 'crypto';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class StartPasswordRecoveryCommand extends Command<void> {
  constructor(public readonly dto: StartPasswordRecoveryDto) {
    super();
  }
}

@CommandHandler(StartPasswordRecoveryCommand)
export class StartPasswordRecoveryUseCase implements ICommandHandler<StartPasswordRecoveryCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute({ dto }: StartPasswordRecoveryCommand): Promise<void> {
    const { email } = dto;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const recoveryCode = randomUUID();

    const ttlSeconds = Number(
      this.configService.getOrThrow<string>('RECOVERY_CODE_TTL_SECONDS'),
    );

    const recoveryCodeExpirationDate = new Date(Date.now() + ttlSeconds * 1000);

    user.setRecoveryCode(recoveryCode, recoveryCodeExpirationDate);

    await this.usersRepository.save(user);
  }
}
