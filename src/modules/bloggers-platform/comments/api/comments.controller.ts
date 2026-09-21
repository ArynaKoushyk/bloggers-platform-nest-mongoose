import { Controller, Get, Param } from '@nestjs/common';
import { CommentViewDto } from './view-dto/comment.view-dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';
import { QueryBus } from '@nestjs/cqrs';
import { GetCommentByIdQuery } from '../application/queries/get-comment-by-id.query-handler';

@Controller('comments')
export class CommentsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async getCommentById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<CommentViewDto> {
    return await this.queryBus.execute(new GetCommentByIdQuery(id));
  }
}
