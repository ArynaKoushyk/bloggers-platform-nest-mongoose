import { LikeStatus } from '../../domain/enums/like-status.enum';

export class LikesInfoViewDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
