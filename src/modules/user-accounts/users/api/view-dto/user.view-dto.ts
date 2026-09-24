import type { Types } from 'mongoose';
import type { User } from '../../domain/user.entity';

type UserReadModel = Pick<User, 'login' | 'email' | 'createdAt'> & {
  _id: Types.ObjectId;
};

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  static mapToView(user: UserReadModel): UserViewDto {
    const dto = new UserViewDto();

    dto.id = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt;

    return dto;
  }
}
