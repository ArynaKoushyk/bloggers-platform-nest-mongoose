import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { PostSortField } from './posts-sort-by';

export class GetPostsQueryParams extends BaseQueryParams {
  sortBy = PostSortField.CreatedAt;
  searchNameTerm: string | null = null;
}
