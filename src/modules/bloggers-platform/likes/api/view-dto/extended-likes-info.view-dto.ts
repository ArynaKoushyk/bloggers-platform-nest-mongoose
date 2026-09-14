import { LikeDetailsViewDto } from './like-details.view-dto';
import { LikesInfoViewDto } from './likes-info.view-dto';

export class ExtendedLikesInfoViewDto extends LikesInfoViewDto {
  newestLikes: LikeDetailsViewDto[];
}
