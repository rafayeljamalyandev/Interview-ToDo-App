import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import {
  EMAIL_OR_EMPTY_REG_EXP,
  PASSWORD_REG_EXP,
} from '../../common/constants/global.constants';

import { VALIDATION_ERROR_MESSAGES } from '../../common/constants/responseMessages.constant';

export class LoginDto {
  @IsOptional()
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
