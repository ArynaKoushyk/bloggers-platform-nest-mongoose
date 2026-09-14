import { Injectable } from '@nestjs/common';
import { User, UserDocument, type UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async save(user: UserDocument): Promise<void> {
    await user.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();
  }

  async findByIdOrFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    return user;
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return await this.UserModel.findOne({ login, deletedAt: null }).exec();
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.UserModel.findOne({ email, deletedAt: null }).exec();
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    return await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      deletedAt: null,
    }).exec();
  }

  //   async findUserByEmailConfirmationCode(
  //     code: string,
  //   ): Promise<UserDocument | null> {
  //     return await UserModel.findOne({
  //       'emailConfirmation.confirmationCode': code,
  //     }).exec();
  //   }

  //   async findUserByPasswordRecoveryCode(
  //     recoveryCode: string,
  //   ): Promise<UserDocument | null> {
  //     return await UserModel.findOne({
  //       'passwordRecovery.recoveryCode': recoveryCode,
  //     }).exec();
  //   }
}
