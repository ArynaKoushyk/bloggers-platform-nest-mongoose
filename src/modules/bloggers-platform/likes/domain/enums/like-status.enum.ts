export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type StoredLikeStatus = Exclude<LikeStatus, LikeStatus.None>;
