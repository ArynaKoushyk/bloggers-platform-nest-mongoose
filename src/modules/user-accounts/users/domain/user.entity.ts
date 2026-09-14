import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: String, required: true, unique: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;

    return user as UserDocument;
  }

  makeDeleted(): void {
    if (this.deletedAt) {
      throw new DomainException({
        code: DomainExceptionCode.Conflict,
        message: 'User is already deleted',
      });
    }

    this.deletedAt = new Date();
  }
}

//   static registerUser(data: RegisterUserData): UserDocument {
//     const user = new UserModel();
//     user.login = data.login;
//     user.email = data.email;
//     user.passwordHash = data.passwordHash;
//     user.createdAt = new Date();
//     user.emailConfirmation = {
//       confirmationCode: data.confirmationCode,
//       expirationDate: data.confirmationCodeExpirationDate,
//       isConfirmed: false,
//     };
//     user.passwordRecovery = {
//       recoveryCode: null,
//       expirationDate: null,
//     };

//     return user;
//   }

//   confirmEmail(
//     this: UserDocument,
//     code: string,
//     currentDate: Date,
//   ): ConfirmEmailDomainResult {
//     if (this.emailConfirmation.isConfirmed) {
//       return {
//         success: false,
//         error: ConfirmEmailError.AlreadyConfirmed,
//       };
//     }

//     if (this.emailConfirmation.confirmationCode !== code) {
//       return {
//         success: false,
//         error: ConfirmEmailError.InvalidCode,
//       };
//     }

//     const expirationDate = this.emailConfirmation.expirationDate;

//     if (!expirationDate || expirationDate <= currentDate) {
//       return {
//         success: false,
//         error: ConfirmEmailError.ExpiredCode,
//       };
//     }

//     this.emailConfirmation.isConfirmed = true;
//     this.emailConfirmation.confirmationCode = null;
//     this.emailConfirmation.expirationDate = null;

//     return { success: true };
//   }

//   updateEmailConfirmationCode(
//     this: UserDocument,
//     code: string,
//     expirationDate: Date,
//   ): boolean {
//     if (this.emailConfirmation.isConfirmed) {
//       return false;
//     }
//     this.emailConfirmation.confirmationCode = code;
//     this.emailConfirmation.expirationDate = expirationDate;
//     return true;
//   }

//   setPasswordRecoveryCode(
//     this: UserDocument,
//     recoveryCode: string,
//     expirationDate: Date,
//   ): void {
//     this.passwordRecovery.recoveryCode = recoveryCode;
//     this.passwordRecovery.expirationDate = expirationDate;
//   }

//   resetPassword(
//     this: UserDocument,
//     recoveryCode: string,
//     passwordHash: string,
//     currentDate: Date,
//   ): ResetPasswordDomainResult {
//     if (this.passwordRecovery.recoveryCode !== recoveryCode) {
//       return {
//         success: false,
//         error: ResetPasswordError.InvalidRecoveryCode,
//       };
//     }

//     const expirationDate = this.passwordRecovery.expirationDate;

//     if (!expirationDate || expirationDate <= currentDate) {
//       return {
//         success: false,
//         error: ResetPasswordError.ExpiredRecoveryCode,
//       };
//     }

//     this.passwordHash = passwordHash;
//     this.passwordRecovery.recoveryCode = null;
//     this.passwordRecovery.expirationDate = null;

//     return { success: true };
//   }
// }

// const passwordRecoverySchema = new Schema<RecoveryPasswordModel>(
//   {
//     recoveryCode: { type: String, default: null },
//     expirationDate: { type: Date, default: null },
//   },
//   {
//     _id: false,
//   },
// );

// const emailConfirmationSchema = new Schema<EmailConfirmationModel>(
//   {
//     confirmationCode: { type: String, default: null },
//     expirationDate: { type: Date, default: null },
//     isConfirmed: { type: Boolean, default: false },
//   },
//   {
//     _id: false,
//   },
// );
// const userSchema = new Schema<
//   UserDbType,
//   UserModelType,
//   UserMethods,
//   {},
//   {},
//   UserStatics
// >(
//   {
//     login: {
//       type: String,
//       required: true,
//       minLength: 1,
//       maxLength: 250,
//       unique: true,
//     },
//     passwordHash: { type: String, required: true },
//     email: {
//       type: String,
//       required: true,
//       minLength: 5,
//       maxLength: 250,
//       unique: true,
//     },
//     createdAt: { type: Date, default: Date.now },
//     emailConfirmation: { type: emailConfirmationSchema },
//     passwordRecovery: { type: passwordRecoverySchema },
//   },
//   { optimisticConcurrency: true },

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<User> & typeof User;
