import type { Types } from 'mongoose';
import type { Blog } from '../../domain/blog.entity';

type BlogReadModel = Pick<
  Blog,
  'name' | 'description' | 'websiteUrl' | 'createdAt' | 'isMembership'
> & {
  _id: Types.ObjectId;
};

export class BlogViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  static mapToView(blog: BlogReadModel): BlogViewDto {
    const dto = new BlogViewDto();

    dto.id = blog._id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.websiteUrl = blog.websiteUrl;
    dto.createdAt = blog.createdAt;
    dto.isMembership = blog.isMembership;

    return dto;
  }
}
