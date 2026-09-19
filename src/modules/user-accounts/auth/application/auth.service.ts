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

/*




confirmRegistration(code) Подтвердить email по коду
resendRegistrationConfirmation(email) 	Создать и отправить новый confirmation code
startPasswordRecovery(email) 	Начать восстановление пароля
resetPassword(dto)
 */
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

  async createAccessToken(userId: string): Promise<string> {
    return this.jwtAdapter.createAccessToken(userId);
  }

  async register(dto: RegisterUserDto): Promise<void> {
    const { login, password, email } = dto;
    const existingLogin = await this.usersRepository.findByLogin(login);

    if (existingLogin) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with the same login already exists',
      });
    }
    const existingEmail = await this.usersRepository.findByEmail(email);

    if (existingEmail) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with the same email already exists',
      });
    }
    const passwordHash = await this.passwordHashAdapter.hashPassword(password);

    const confirmationCode = randomUUID();

    const ttlSeconds = Number(
      this.configService.getOrThrow<string>(
        'EMAIL_CONFIRMATION_CODE_TTL_SECONDS',
      ),
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

  async confirmRegistration() {}
}
