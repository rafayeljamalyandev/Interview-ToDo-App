import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserEnum } from '../enums/user.enum';

export const CurrentUser = createParamDecorator(
  (key: CurrentUserEnum, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return key ? request.user?.[key] : request.user;
  },
);
