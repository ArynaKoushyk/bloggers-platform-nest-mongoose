import { UpdatePostDto } from '../../application/dto/update-post.dto';
import { CreatePostInputDto } from './create-post.input-dto';
export class UpdatePostInputDto
  extends CreatePostInputDto
  implements UpdatePostDto {}
