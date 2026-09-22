import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthQueryRepository } from '../../infrastructure/query/auth.query-repository';
import { MeViewDto } from '../../api/view-dto/me.view-dto';

export class GetCurrentUserQuery extends Query<MeViewDto> {
  constructor(public readonly userId: string) {
    super();
  }
}

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserQueryHandler implements IQueryHandler<GetCurrentUserQuery> {
  constructor(private readonly authQueryRepository: AuthQueryRepository) {}

  execute({ userId }: GetCurrentUserQuery): Promise<MeViewDto> {
    return this.authQueryRepository.findCurrentUserByIdOrFail(userId);
  }
}
