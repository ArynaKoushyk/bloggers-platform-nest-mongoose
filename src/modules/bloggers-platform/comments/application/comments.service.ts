import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { CreateCommentDomainDto } from '../domain/dto/create-comment.domain.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../domain/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { UserContextDto } from '../../../user-accounts/auth/application/dto/user-context.dto';
import { UpdateCommentDomainDto } from '../domain/dto/update-comment.domain.dto';
import { CommentAccessPolicy } from './policies/comment-access.policy';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
    private readonly commentAccessPolicy: CommentAccessPolicy,
    private postsRepository: PostsRepository,
  ) {}

  async createComment(
    postId: string,
    dto: CreateCommentDto,
    user: UserContextDto,
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
    const createdComment = this.commentModel.createInstance(createData);
    await this.commentsRepository.save(createdComment);

    return createdComment._id.toString();
  }

  async updateComment(
    commentId: string,
    userId: string,
    dto: UpdateCommentDto,
  ): Promise<void> {
    const comment = await this.commentsRepository.findByIdOrFail(commentId);
    this.commentAccessPolicy.assertCanModify(comment, userId);
    const domainDto: UpdateCommentDomainDto = {
      content: dto.content,
    };
    comment.update(domainDto);
    await this.commentsRepository.save(comment);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findByIdOrFail(commentId);
    this.commentAccessPolicy.assertCanModify(comment, userId);
    comment.markAsDeleted();
    await this.commentsRepository.save(comment);
  }
}
