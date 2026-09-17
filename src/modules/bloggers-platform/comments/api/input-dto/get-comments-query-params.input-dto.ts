import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '../../../../../core/dto/base-query-params.input-dto';
import { CommentSortField } from './enums/comment-sort-field.enum';

export class GetCommentsQueryParams extends BaseQueryParams {
  @IsEnum(CommentSortField)
  sortBy = CommentSortField.CreatedAt;
}
