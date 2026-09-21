import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginatedViewDto } from '../../../../core/dto/base-paginated.view-dto';
import { GetCommentsQueryParams } from './input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from './view-dto/comment.view-dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';
import { QueryBus } from '@nestjs/cqrs';
import { GetPostCommentsQuery } from '../application/queries/get-post-comments.query-handler';

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getPostComments(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Query() queryParams: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return await this.queryBus.execute(
      new GetPostCommentsQuery(postId, queryParams),
    );
  }
}
