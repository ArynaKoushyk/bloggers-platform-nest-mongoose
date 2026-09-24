import type { Types } from 'mongoose';
import type { User } from '../../../users/domain/user.entity';

type CurrentUserReadModel = Pick<User, 'login' | 'email'> & {
  _id: Types.ObjectId;
};

export class MeViewDto {
  userId: string;
  login: string;
  email: string;

  static mapToView(user: CurrentUserReadModel): MeViewDto {
    const dto = new MeViewDto();

    dto.userId = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;

    return dto;
  }
}
