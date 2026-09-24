export class ConfirmationCodeRenewedEvent {
  constructor(
    public readonly email: string,
    public readonly confirmationCode: string,
  ) {}
}
