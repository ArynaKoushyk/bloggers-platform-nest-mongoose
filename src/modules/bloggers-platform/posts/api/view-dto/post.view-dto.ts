import { PostDocument } from '../../domain/post.entity';
import { ExtendedLikesInfoViewDto } from '../../../likes/api/view-dto/extended-likes-info.view-dto';
import { LikeStatus } from '../../../likes/domain/enums/like-status.enum';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: Date;
  blogId: string;
  blogName: string;
  extendedLikesInfo: ExtendedLikesInfoViewDto;

  static mapToView(post: PostDocument): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.createdAt = post.createdAt;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.extendedLikesInfo = {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus: LikeStatus.None,
      newestLikes: [],
    };

    return dto;
  }
}
