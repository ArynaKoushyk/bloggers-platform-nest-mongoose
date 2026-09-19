import { UpdateCommentDto } from '../../application/dto/update-comment.dto';
import { CreateCommentInputDto } from './create-comment.input-dto';

export class UpdateCommentInputDto
  extends CreateCommentInputDto
  implements UpdateCommentDto {}
