import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CreateCommentInputDto } from './create-comment.input-dto';

export class UpdateCommentInputDto
  extends CreateCommentInputDto
  implements UpdateCommentDto {}
