import { ConfigService } from '@nestjs/config';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-code.enum';
import { DomainException } from '../../../../../core/exceptions/domain.exception';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { ResendRegistrationConfirmationEmailDto } from '../dto/resend-registration-confirmation-email.dto';
import { randomUUID } from 'crypto';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ResendRegistrationConfirmationCommand extends Command<void> {
  constructor(public readonly dto: ResendRegistrationConfirmationEmailDto) {
    super();
  }
}
@CommandHandler(ResendRegistrationConfirmationCommand)
export class ResendRegistrationConfirmationUseCase implements ICommandHandler<ResendRegistrationConfirmationCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute({ dto }: ResendRegistrationConfirmationCommand): Promise<void> {
    const { email } = dto;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email is not registered',
        extensions: [
          {
            message: 'Email is not registered',
            key: 'email',
          },
        ],
      });
    }

    const newConfirmationCode = randomUUID();

    const ttlSeconds = Number(
      this.configService.getOrThrow<string>('CONFIRMATION_CODE_TTL_SECONDS'),
    );

    const newConfirmationCodeExpirationDate = new Date(
      Date.now() + ttlSeconds * 1000,
    );

    const isUpdated = user.setConfirmationCode(
      newConfirmationCode,
      newConfirmationCodeExpirationDate,
    );

    if (!isUpdated) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email is already confirmed',
        extensions: [
          {
            message: 'Email is already confirmed',
            key: 'email',
          },
        ],
      });
    }

    await this.usersRepository.save(user);
  }
}
