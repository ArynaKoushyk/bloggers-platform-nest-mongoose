import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { BlogSortField } from './enums/blog-sort-field.enum';

export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(BlogSortField)
  sortBy = BlogSortField.CreatedAt;

  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
