import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-code.enum';
import { DomainException } from '../../../../../core/exceptions/domain.exception';
import { ConfirmEmailError } from '../../../users/domain/enums/confirm-email-error.enum';
import { UsersRepository } from '../../../users/infrastructure/repositories/users.repository';
import { ConfirmRegistrationDto } from '../dto/confirm-registration.dto';

export class ConfirmRegistrationCommand extends Command<void> {
  constructor(public readonly dto: ConfirmRegistrationDto) {
    super();
  }
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase implements ICommandHandler<ConfirmRegistrationCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ dto }: ConfirmRegistrationCommand): Promise<void> {
    const { code } = dto;
    const user = await this.usersRepository.findByConfirmationCode(code);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation code is incorrect',
        extensions: [
          {
            message: 'Confirmation code is incorrect',
            key: 'code',
          },
        ],
      });
    }

    const currentDate = new Date();

    const result = user.confirmEmail(code, currentDate);

    if (result === ConfirmEmailError.AlreadyConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email is already confirmed',
        extensions: [
          {
            message: 'Email is already confirmed',
            key: 'code',
          },
        ],
      });
    }

    if (result === ConfirmEmailError.InvalidCode) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation code is incorrect',
        extensions: [
          {
            message: 'Confirmation code is incorrect',
            key: 'code',
          },
        ],
      });
    }

    if (result === ConfirmEmailError.ExpiredCode) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation code is expired',
        extensions: [
          {
            message: 'Confirmation code is expired',
            key: 'code',
          },
        ],
      });
    }

    await this.usersRepository.save(user);
  }
}
