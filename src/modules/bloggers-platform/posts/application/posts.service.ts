import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const createdPost = this.PostModel.createInstance(dto);
    await this.postsRepository.save(createdPost);
    return createdPost._id.toString();
  }
  async updatePost(id: string, dto: UpdatePostDto): Promise<string> {
    const post = await this.postsRepository.findByIdOrFail(id);
    post.update(dto);
    await this.postsRepository.save(post);

    return post._id.toString();
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.postsRepository.findByIdOrFail(id);
    post.makeDeleted();
    await this.postsRepository.save(post);
  }
}
