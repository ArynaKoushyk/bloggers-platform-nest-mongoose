import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { BlogSortField } from './blogs-sort-by';

export class GetBlogQueryParams extends BaseQueryParams {
  sortBy = BlogSortField.CreatedAt;
  searchNameTerm: string | null = null;
}
