import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { PostSortField } from './enums/post-sort-field.enum';

export class GetPostsQueryParams extends BaseQueryParams {
  @IsEnum(PostSortField)
  sortBy = PostSortField.CreatedAt;

  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
