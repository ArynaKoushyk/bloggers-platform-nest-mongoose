import { IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim.decorator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim.decorator';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import {
  registrationEmailConstraints,
  registrationLoginConstraints,
  registrationPasswordConstraints,
} from './constants/registration-validation.constants';

export class RegistrationInputDto implements RegisterUserDto {
  @IsStringWithTrim(
    registrationLoginConstraints.minLength,
    registrationLoginConstraints.maxLength,
  )
  @Matches(registrationLoginConstraints.match)
  login: string;

  @Trim()
  @IsString()
  @Matches(registrationEmailConstraints.match)
  email: string;

  @IsString()
  @Length(
    registrationPasswordConstraints.minLength,
    registrationPasswordConstraints.maxLength,
  )
  password: string;
}
