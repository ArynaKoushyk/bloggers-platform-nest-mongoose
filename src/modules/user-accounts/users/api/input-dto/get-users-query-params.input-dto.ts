import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { UserSortField } from './enums/user-sort-field.enum';

export class GetUsersQueryParams extends BaseQueryParams {
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;

  @IsEnum(UserSortField)
  sortBy = UserSortField.CreatedAt;
}
