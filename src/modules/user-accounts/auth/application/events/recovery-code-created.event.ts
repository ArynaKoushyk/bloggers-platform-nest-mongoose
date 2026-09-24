export class RecoveryCodeCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly recoveryCode: string,
  ) {}
}
