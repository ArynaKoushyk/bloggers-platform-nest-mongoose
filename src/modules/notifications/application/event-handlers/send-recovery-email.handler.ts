import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RecoveryCodeCreatedEvent } from '../../../user-accounts/auth/application/events/recovery-code-created.event';
import { EmailAdapter } from '../../infrastructure/adapters/email.adapter';

@EventsHandler(RecoveryCodeCreatedEvent)
export class SendRecoveryEmailHandler implements IEventHandler<RecoveryCodeCreatedEvent> {
  constructor(private readonly emailAdapter: EmailAdapter) {}

  async handle({
    email,
    recoveryCode,
  }: RecoveryCodeCreatedEvent): Promise<void> {
    await this.emailAdapter.sendPasswordRecovery(email, recoveryCode);
  }
}
