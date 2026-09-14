import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { CreateCommentDomainDto } from '../domain/dto/create-comment.domain.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../domain/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CurrentUser } from '../../../../core/types/current-user.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async createComment(
    postId: string,
    dto: CreateCommentDto,
    user: CurrentUser,
  ): Promise<string> {
    const { content } = dto;

    await this.postsRepository.findByIdOrFail(postId);
    const createData: CreateCommentDomainDto = {
      postId,
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
    };
    const createdComment = this.CommentModel.createInstance(createData);
    await this.commentsRepository.save(createdComment);

    return createdComment._id.toString();
  }

  async updateComment(
    commentId: string,
    dto: UpdateCommentDto,
    userId: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findByIdOrFail(commentId);
    comment.update(userId, dto);
    await this.commentsRepository.save(comment);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findByIdOrFail(commentId);
    comment.makeDeleted(userId);
    await this.commentsRepository.save(comment);
  }
}
