import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { UserSortField } from './users-sort-by';

export class GetUserQueryParams extends BaseQueryParams {
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
  sortBy = UserSortField.CreatedAt;
}
