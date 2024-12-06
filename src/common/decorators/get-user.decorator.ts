import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/common/types';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
);
