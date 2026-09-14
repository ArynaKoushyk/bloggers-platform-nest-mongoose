import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../../domain/user.entity';
import { GetUserQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base-paginated.view-dto';
import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { FilterQuery } from 'mongoose';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findAll(
    query: GetUserQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    } = query;
    const skip = query.calculateSkip();
    const limit = pageSize;
    const filter: FilterQuery<User> = { deletedAt: null };
    const searchConditions: FilterQuery<User>[] = [];

    if (searchLoginTerm) {
      searchConditions.push({
        login: {
          $regex: query.searchLoginTerm,
          $options: 'i',
        },
      });
    }

    if (searchEmailTerm) {
      searchConditions.push({
        email: {
          $regex: query.searchEmailTerm,
          $options: 'i',
        },
      });
    }

    if (searchConditions.length > 0) {
      filter.$or = searchConditions;
    }

    const users = await this.UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await this.UserModel.countDocuments(filter).exec();

    const items = users.map((u) => UserViewDto.mapToView(u));
    return PaginatedViewDto.mapToView({
      items,
      page: pageNumber,
      size: pageSize,
      totalCount,
    });
  }

  async findByIdOrFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }
    return UserViewDto.mapToView(user);
  }
}
