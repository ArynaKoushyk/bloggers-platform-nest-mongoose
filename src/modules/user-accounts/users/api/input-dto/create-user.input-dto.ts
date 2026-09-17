import { IsString, Length, Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import { CreateUserDto } from '../../dto/create-user.dto';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from './constants/user-validation.constants';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class CreateUserInputDto implements CreateUserDto {
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  @Matches(loginConstraints.match)
  login: string;

  @Trim()
  @IsString()
  @Matches(emailConstraints.match)
  email: string;

  @IsString()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  password: string;
}
