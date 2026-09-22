import { ApiParam } from '@nestjs/swagger';
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
  UseGuards,
} from '@nestjs/common';
import { PostViewDto } from './view-dto/post.view-dto';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base-paginated.view-dto';
import { CreatePostInputDto } from './input-dto/create-post.input-dto';
import { UpdatePostInputDto } from './input-dto/update-post.input-dto';
import { BasicAuthGuard } from '../../../user-accounts/auth/guards/basic/basic-auth.guard';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query-handler';
import { GetPostsQuery } from '../application/queries/get-posts.query-handler';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    console.log('PostsController created');
  }

  @ApiParam({ name: 'id' })
  @Get(':id')
  async getPostById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<PostViewDto> {
    return await this.queryBus.execute(new GetPostByIdQuery(id));
  }

  @Get()
  async getPosts(
    @Query() queryParams: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return await this.queryBus.execute(new GetPostsQuery(queryParams));
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() dto: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.commandBus.execute(new CreatePostCommand(dto));

    return await this.queryBus.execute(new GetPostByIdQuery(postId));
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdatePostInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdatePostCommand(id, dto));
  }

  @ApiParam({ name: 'id' })
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePost(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    return await this.commandBus.execute(new DeletePostCommand(id));
  }
}
