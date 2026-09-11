import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from '../domain/blog.entity';
import type { BlogDocument, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();
  }

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
  }

  async findByIdOrThrow(id: string): Promise<BlogDocument> {
    const blog = await this.findById(id);

    if (!blog) {
      //TODO: replace with domain exception
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }
}
