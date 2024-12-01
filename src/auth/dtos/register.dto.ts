import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EMAIL_OR_EMPTY_REG_EXP, PASSWORD_REG_EXP } from '../../common/constants/global.constants';

import { VALIDATION_ERROR_MESSAGES } from '../../common/constants/responseMessages.constant';
import { IUser } from '../../common/interfaces/user.interface';

export class RegisterDto {
  @IsOptional()
  @MinLength(0, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_FIRSTNAME,
  })
  @MaxLength(50, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_FIRSTNAME,
  })
  @Matches(/^(?!\s*$).+/, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_FIRSTNAME,
  })
  firstName: string;

  @IsOptional()
  @MinLength(0, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_LASTNAME,
  })
  @MaxLength(50, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_LASTNAME,
  })
  @Matches(/^(?!\s*$).+/, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_LASTNAME,
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(EMAIL_OR_EMPTY_REG_EXP, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_EMAIL,
  })
  email: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REG_EXP, {
    message: VALIDATION_ERROR_MESSAGES.INVALID_PASSWORD,
  })
  password: string;
}

export class SignInResponse {
  user: IUser;
  accessToken: string;
}