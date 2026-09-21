import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentAccessPolicy } from '../policies/comment-access.policy';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteCommentCommand extends Command<void> {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {
    super();
  }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentAccessPolicy: CommentAccessPolicy,
  ) {}

  async execute({ commentId, userId }: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentsRepository.findByIdOrFail(commentId);
    this.commentAccessPolicy.assertCanModify(comment, userId);
    comment.markAsDeleted();
    await this.commentsRepository.save(comment);
  }
}
