import { UpdateCommentDto } from '../../dto/update-comment.dto';

export class UpdateCommentInputDto implements UpdateCommentDto {
  content: string;
}
