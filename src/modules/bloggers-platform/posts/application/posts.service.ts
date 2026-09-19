import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { CreatePostDomainDto } from '../domain/dto/create-post.domain.dto';
import { UpdatePostDomainDto } from '../domain/dto/update-post.domain.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const { title, shortDescription, content, blogId } = dto;

    const blog = await this.blogsRepository.findByIdOrFail(blogId);

    const domainDto: CreatePostDomainDto = {
      title,
      shortDescription,
      content,
      blogId: blog._id.toString(),
      blogName: blog.name,
    };

    const createdPost = this.postModel.createInstance(domainDto);

    await this.postsRepository.save(createdPost);

    return createdPost._id.toString();
  }
  async updatePost(id: string, dto: UpdatePostDto): Promise<void> {
    const post = await this.postsRepository.findByIdOrFail(id);

    const { title, shortDescription, content, blogId } = dto;

    const blog = await this.blogsRepository.findByIdOrFail(blogId);

    const domainDto: UpdatePostDomainDto = {
      title,
      shortDescription,
      content,
      blogId: blog._id.toString(),
      blogName: blog.name,
    };

    post.update(domainDto);

    await this.postsRepository.save(post);
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.postsRepository.findByIdOrFail(id);
    post.markAsDeleted();
    await this.postsRepository.save(post);
  }
}
