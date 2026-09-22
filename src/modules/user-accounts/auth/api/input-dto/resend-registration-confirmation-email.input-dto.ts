import { IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim.decorator';
import type { ResendRegistrationConfirmationEmailDto } from '../../application/dto/resend-registration-confirmation-email.dto';
import { authEmailConstraints } from './constants/auth-validation.constants';

export class ResendRegistrationConfirmationEmailInputDto implements ResendRegistrationConfirmationEmailDto {
  @Trim()
  @IsString()
  @Matches(authEmailConstraints.match)
  email: string;
}
