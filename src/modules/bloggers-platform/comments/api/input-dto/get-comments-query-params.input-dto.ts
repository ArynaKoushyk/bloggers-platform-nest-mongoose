import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { CommentSortField } from './comments-sort-by';

export class GetCommentsQueryParams extends BaseQueryParams {
  sortBy = CommentSortField.CreatedAt;
}
