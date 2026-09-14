import { CommentatorInfo } from '../schemas/commentator-info.schema';

export class CreateCommentDomainDto {
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
}
