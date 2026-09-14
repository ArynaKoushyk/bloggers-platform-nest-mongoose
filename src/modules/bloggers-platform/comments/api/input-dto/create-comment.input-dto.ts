import { CreateCommentDto } from '../../dto/create-comment.dto';

export class CreateCommentInputDto implements CreateCommentDto {
  content: string;
}
