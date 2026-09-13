import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { ApiParam } from '@nestjs/swagger';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { GetBlogQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base-paginated.view-dto';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../../posts/api/view-dto/post.view-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsService: BlogsService,
  ) {
    console.log('BlogsController created');
  }

  @ApiParam({ name: 'id' }) //для сваггера
  @Get(':id') //users/232342-sdfssdf-23234323
  async getBlogById(@Param('id') id: string): Promise<BlogViewDto> {
    // можем и чаще так и делаем возвращать Promise из action. Сам NestJS будет дожидаться, когда
    // промис зарезолвится и затем NestJS вернёт результат клиенту
    return this.blogsQueryRepository.findByIdOrFail(id);
  }

  @Get()
  async getAllBlogs(
    @Query() query: GetBlogQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get('/:blogId/posts')
  async getAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsQueryRepository.findByIdOrFail(blogId);
    return this.postsQueryRepository.findAllByBlogId(blogId, query);
  }

  @Post()
  async createBlog(@Body() dto: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(dto);

    return this.blogsQueryRepository.findByIdOrFail(blogId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<BlogViewDto> {
    const blogId = await this.blogsService.updateBlog(id, body);

    return this.blogsQueryRepository.findByIdOrFail(blogId);
  }

  @ApiParam({ name: 'id' }) //для сваггера
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }
}
