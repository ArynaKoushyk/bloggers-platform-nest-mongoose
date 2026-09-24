import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MeViewDto } from '../../api/view-dto/me.view-dto';
import { User, type UserModelType } from '../../../users/domain/user.entity';
import { DomainException } from '../../../../../core/exceptions/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-code.enum';

@Injectable()
export class AuthQueryRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModelType,
  ) {}

  async findCurrentUserByIdOrFail(userId: string): Promise<MeViewDto> {
    const user = await this.userModel
      .findOne({
        _id: userId,
        deletedAt: null,
      })
      .lean()
      .exec();

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    return MeViewDto.mapToView(user);
  }
}
