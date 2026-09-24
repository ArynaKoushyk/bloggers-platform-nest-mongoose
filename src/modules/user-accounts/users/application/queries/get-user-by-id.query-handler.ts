import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { UsersQueryRepository } from '../../infrastructure/query/users.query-repository';

export class GetUserByIdQuery extends Query<UserViewDto> {
  constructor(public readonly userId: string) {
    super();
  }
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  execute({ userId }: GetUserByIdQuery): Promise<UserViewDto> {
    return this.usersQueryRepository.findByIdOrFail(userId);
  }
}
