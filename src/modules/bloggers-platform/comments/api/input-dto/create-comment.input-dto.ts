import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { commentContentConstraints } from './constants/comment-validation.constants';

export class CreateCommentInputDto implements CreateCommentDto {
  @IsStringWithTrim(
    commentContentConstraints.minLength,
    commentContentConstraints.maxLength,
  )
  content: string;
}
