import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../infrastructure/adapters/email.adapter';
import { UserRegisteredEvent } from '../../../user-accounts/auth/application/events/user-registered.event';
import { ConfirmationCodeRenewedEvent } from '../../../user-accounts/auth/application/events/confirmation-code-renewed.event';

type ConfirmationEmailEvent =
  UserRegisteredEvent | ConfirmationCodeRenewedEvent;

@EventsHandler(UserRegisteredEvent, ConfirmationCodeRenewedEvent)
export class SendConfirmationEmailHandler implements IEventHandler<ConfirmationEmailEvent> {
  constructor(private readonly emailAdapter: EmailAdapter) {}

  async handle({
    email,
    confirmationCode,
  }: ConfirmationEmailEvent): Promise<void> {
    await this.emailAdapter.sendRegistrationConfirmation(
      email,
      confirmationCode,
    );
  }
}
