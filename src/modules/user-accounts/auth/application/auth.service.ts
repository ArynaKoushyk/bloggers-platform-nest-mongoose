import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { PasswordHashAdapter } from '../../users/infrastructure/adapters/password-hash.adapter';
import { UserContextDto } from './dto/user-context.dto';
import { DomainException } from '../../../../core/exceptions/domain.exception';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-code.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHashAdapter: PasswordHashAdapter,
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
}
