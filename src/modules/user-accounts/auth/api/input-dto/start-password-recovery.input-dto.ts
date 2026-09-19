import { IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim.decorator';
import type { StartPasswordRecoveryDto } from '../../application/dto/start-password-recovery.dto';
import { authEmailConstraints } from './constants/auth-validation.constants';

export class StartPasswordRecoveryInputDto
  implements StartPasswordRecoveryDto
{
  @Trim()
  @IsString()
  @Matches(authEmailConstraints.match)
  email: string;
}
