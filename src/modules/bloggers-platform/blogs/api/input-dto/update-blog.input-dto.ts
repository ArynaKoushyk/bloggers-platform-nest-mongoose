import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { CreateBlogInputDto } from './create-blog.input-dto';

export class UpdateBlogInputDto
  extends CreateBlogInputDto
  implements UpdateBlogDto {}
