import { UserDocument } from '../../../users/domain/user.entity';

export class MeViewDto {
  userId: string;
  login: string;
  email: string;

  static mapToView(user: UserDocument): MeViewDto {
    const dto = new MeViewDto();

    dto.userId = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;

    return dto;
  }
}
