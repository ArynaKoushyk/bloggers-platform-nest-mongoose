import { Matches } from 'class-validator';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
  blogDescriptionConstraints,
  blogNameConstraints,
  blogWebsiteUrlConstraints,
} from './constants/blog-validation.constants';

export class CreateBlogInputDto implements CreateBlogDto {
  @IsStringWithTrim(
    blogNameConstraints.minLength,
    blogNameConstraints.maxLength,
  )
  name: string;

  @IsStringWithTrim(
    blogDescriptionConstraints.minLength,
    blogDescriptionConstraints.maxLength,
  )
  description: string;

  @IsStringWithTrim(
    blogWebsiteUrlConstraints.minLength,
    blogWebsiteUrlConstraints.maxLength,
  )
  @Matches(blogWebsiteUrlConstraints.match)
  websiteUrl: string;
}
