import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BlogsQueryRepository } from '../../blogs/infrastructure/query/blogs.query-repository';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { CreatePostForBlogInputDto } from './input-dto/create-post-for-blog.input-dto';
import { PostViewDto } from './view-dto/post.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base-paginated.view-dto';
import type { CreatePostDto } from '../dto/create-post.dto';

@Controller('blogs/:blogId/posts')
export class BlogPostsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async getAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsQueryRepository.findByIdOrFail(blogId);

    return this.postsQueryRepository.findPostsByBlogId(blogId, query);
  }

  @Post()
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() dto: CreatePostForBlogInputDto,
  ): Promise<PostViewDto> {
    const data: CreatePostDto = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId,
    };

    const postId = await this.postsService.createPost(data);

    return this.postsQueryRepository.findByIdOrFail(postId);
  }
}
