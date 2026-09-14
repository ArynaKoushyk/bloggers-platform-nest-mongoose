import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  CommentatorInfo,
  CommentatorInfoSchema,
} from './schemas/commentator-info.schema';
import { CreateCommentDomainDto } from './dto/create-comment.domain.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Schema({ timestamps: true, collection: 'comments' })
export class Comment {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;
  @Prop({
    type: CommentatorInfoSchema,
    required: true,
  })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: Number, required: true, default: 0 })
  likesCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  dislikesCount: number;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createInstance(dto: CreateCommentDomainDto): CommentDocument {
    const { postId, content, commentatorInfo } = dto;
    const comment = new this();
    comment.postId = postId;
    comment.content = content;
    comment.commentatorInfo = commentatorInfo;
    return comment as CommentDocument;
  }

  update(userId: string, dto: UpdateCommentDto): void {
    const { content } = dto;
    this.verifyOwner(userId);
    this.content = content;
  }

  makeDeleted(userId: string): void {
    this.verifyOwner(userId);
    if (this.deletedAt) {
      throw new DomainException({
        code: DomainExceptionCode.Conflict,
        message: 'Comment is already deleted',
      });
    }

    this.deletedAt = new Date();
  }

  private verifyOwner(userId: string): void {
    if (this.commentatorInfo.userId !== userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'You are not the owner of this comment',
      });
    }
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;
export type CommentModelType = Model<Comment> & typeof Comment;
