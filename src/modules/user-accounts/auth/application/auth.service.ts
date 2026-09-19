import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { PasswordHashAdapter } from '../../common/adapters/password-hash.adapter';
import { UserContextDto } from './dto/user-context.dto';
import { DomainException } from '../../../../core/exceptions/domain.exception';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-code.enum';
import { CreateUnconfirmedUserDomainDto } from '../../users/domain/dto/create-unconfirmed-user.domain.dto';
import { randomUUID } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../../users/domain/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAdapter } from '../../common/adapters/jwt.adapter';
import { EmailAdapter } from '../../common/adapters/email.adapter';
import { ConfigService } from '@nestjs/config';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { ResendRegistrationConfirmationEmailDto } from './dto/resend-registration-confirmation-email.dto';
import { StartPasswordRecoveryDto } from './dto/start-password-recovery.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmEmailError } from '../../users/domain/enums/confirm-email-error.enum';
import { ResetPasswordError } from '../../users/domain/enums/reset-password-error.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private readonly jwtAdapter: JwtAdapter,
    private passwordHashAdapter: PasswordHashAdapter,
    private readonly emailAdapter: EmailAdapter,
    private readonly configService: ConfigService,
  ) {}

  async validateCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid credentials',
      });
    }
    const isPasswordValid = await this.passwordHashAdapter.verifyPassword({
      password,
      hash: user.passwordHash,
    });

    if (!isPasswordValid) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid credentials',
      });
    }

    return {
      id: user._id.toString(),
      login: user.login,
    };
  }

  async createAccessToken(userId: string): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtAdapter.createAccessToken(userId);
    return {
      accessToken: accessToken,
    };
  }

  async registerUser(dto: RegisterUserDto): Promise<void> {
    const { login, password, email } = dto;
    const existingLogin = await this.usersRepository.findByLogin(login);

    if (existingLogin) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with the same login already exists',
        extensions: [
          {
            message: 'User with the same login already exists',
            key: 'login',
          },
        ],
      });
    }
    const existingEmail = await this.usersRepository.findByEmail(email);

    if (existingEmail) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with the same email already exists',
        extensions: [
          {
            message: 'User with the same email already exists',
            key: 'email',
          },
        ],
      });
    }
    const passwordHash = await this.passwordHashAdapter.hashPassword(password);

    const confirmationCode = randomUUID();

    const ttlSeconds = Number(
      this.configService.getOrThrow<string>('CONFIRMATION_CODE_TTL_SECONDS'),
    );

    const confirmationCodeExpirationDate = new Date(
      Date.now() + ttlSeconds * 1000,
    );

    const data: CreateUnconfirmedUserDomainDto = {
      login,
      passwordHash,
      email,
      confirmationCode,
      confirmationCodeExpirationDate,
    };

    const user = this.UserModel.createUnconfirmed(data);
    await this.usersRepository.save(user);

    await this.emailAdapter.sendRegistrationConfirmation(
      email,
      confirmationCode,
    );
  }

  async confirmRegistration(dto: ConfirmRegistrationDto): Promise<void> {
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

  async resendRegistrationConfirmationEmail(
    dto: ResendRegistrationConfirmationEmailDto,
  ): Promise<void> {
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

    await this.emailAdapter.sendRegistrationConfirmation(
      email,
      newConfirmationCode,
    );
  }

  async startPasswordRecovery(dto: StartPasswordRecoveryDto): Promise<void> {
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

    await this.emailAdapter.sendPasswordRecovery(email, recoveryCode);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { newPassword, recoveryCode } = dto;
    const user = await this.usersRepository.findByRecoveryCode(recoveryCode);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Recovery code is invalid or expired',
        extensions: [
          {
            message: 'Recovery code is invalid or expired',
            key: 'recoveryCode',
          },
        ],
      });
    }

    const currentDate = new Date();

    const newPasswordHash =
      await this.passwordHashAdapter.hashPassword(newPassword);
    const result = user.resetPassword(
      recoveryCode,
      newPasswordHash,
      currentDate,
    );

    if (result === ResetPasswordError.ExpiredRecoveryCode) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Recovery code is expired',
        extensions: [
          {
            message: 'Recovery code is expired',
            key: 'recoveryCode',
          },
        ],
      });
    }

    if (result === ResetPasswordError.InvalidRecoveryCode) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Recovery code is invalid',
        extensions: [
          {
            message: 'Recovery code is invalid',
            key: 'recoveryCode',
          },
        ],
      });
    }

    await this.usersRepository.save(user);
  }
}
