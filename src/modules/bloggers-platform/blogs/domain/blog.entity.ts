import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Boolean, required: true, default: false })
  isMembership!: boolean;

  @Prop({ type: Date, nullable: true, default: null })
  deletedAt: Date | null;

  static createInstance(dto: CreateBlogDto): BlogDocument {
    const { name, description, websiteUrl } = dto;

    const blog = new this();

    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.isMembership = false;

    return blog as BlogDocument;
  }

  update(dto: UpdateBlogDto): void {
    const { name, description, websiteUrl } = dto;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }

  makeDeleted() {
    if (this.deletedAt) {
      throw new DomainException({
        code: DomainExceptionCode.Conflict,
        message: 'Blog is already deleted',
      });
    }
    this.deletedAt = new Date();
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;
export type BlogModelType = Model<Blog> & typeof Blog;
