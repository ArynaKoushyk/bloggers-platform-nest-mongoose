import { LikeTargetType } from '../enums/like-target-type.enum';
import type { StoredLikeStatus } from '../enums/like-status.enum';

export class CreateLikeDomainDto {
  targetId: string;
  targetType: LikeTargetType;
  authorId: string;
  authorLogin: string;
  status: StoredLikeStatus;
}
