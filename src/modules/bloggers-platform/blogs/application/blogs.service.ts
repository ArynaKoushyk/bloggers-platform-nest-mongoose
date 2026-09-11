import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const createdBlog = this.BlogModel.createInstance(dto);

    await this.blogsRepository.save(createdBlog);
    return createdBlog._id.toString();
  }
  async updateBlog(id: string, dto: UpdateBlogDto): Promise<string> {
    const blog = await this.blogsRepository.findByIdOrThrow(id);
    blog.update(dto);
    await this.blogsRepository.save(blog);

    return blog._id.toString();
  }

  async deleteBlog(id: string): Promise<void> {
    const blog = await this.blogsRepository.findByIdOrThrow(id);
    blog.makeDeleted();
    await this.blogsRepository.save(blog);
  }
}
