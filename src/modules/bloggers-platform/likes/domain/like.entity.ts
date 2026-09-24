import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeTargetType } from './enums/like-target-type.enum';
import { LikeStatus, type StoredLikeStatus } from './enums/like-status.enum';
import { CreateLikeDomainDto } from './dto/create-like.domain.dto';

@Schema({ timestamps: true, collection: 'likes' })
export class Like {
  @Prop({ type: String, required: true })
  targetId: string;

  @Prop({
    type: String,
    enum: Object.values(LikeTargetType),
    required: true,
  })
  targetType: LikeTargetType;

  @Prop({ type: String, required: true })
  authorId: string;

  @Prop({ type: String, required: true })
  authorLogin: string;

  @Prop({
    type: String,
    enum: [LikeStatus.Like, LikeStatus.Dislike],
    required: true,
  })
  status: StoredLikeStatus;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreateLikeDomainDto): LikeDocument {
    const like = new this();

    like.targetId = dto.targetId;
    like.targetType = dto.targetType;
    like.authorId = dto.authorId;
    like.authorLogin = dto.authorLogin;
    like.status = dto.status;

    return like as LikeDocument;
  }

  updateStatus(status: StoredLikeStatus): void {
    this.status = status;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.loadClass(Like);

LikeSchema.index(
  {
    targetId: 1,
    targetType: 1,
    authorId: 1,
  },
  {
    unique: true,
  },
);

export type LikeDocument = HydratedDocument<Like>;
export type LikeModelType = Model<Like> & typeof Like;
