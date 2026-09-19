export class CreateUnconfirmedUserDomainDto {
  login: string;
  email: string;
  passwordHash: string;
  confirmationCode: string;
  confirmationCodeExpirationDate: Date;
}
