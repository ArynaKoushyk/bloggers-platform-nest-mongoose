import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../domain/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { DomainException } from '../../../../core/exceptions/domain.exception';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-code.enum';
import { PasswordHashAdapter } from '../../common/adapters/password-hash.adapter';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private passwordHashAdapter: PasswordHashAdapter,
  ) {}

  async createConfirmedUser(dto: CreateUserDto): Promise<string> {
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

    const data: CreateUserDomainDto = {
      login,
      passwordHash,
      email,
    };

    const user = this.UserModel.createConfirmed(data);
    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findByIdOrFail(id);
    user.markAsDeleted();
    await this.usersRepository.save(user);
  }
}
