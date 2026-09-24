import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/repositories/users.repository';
import { MeViewDto } from '../../api/view-dto/me.view-dto';

@Injectable()
export class AuthQueryRepository {
  constructor(private usersRepository: UsersRepository) {}

  async findCurrentUserByIdOrFail(userId: string): Promise<MeViewDto> {
    const user = await this.usersRepository.findByIdOrFail(userId);

    return MeViewDto.mapToView(user);
  }
}
