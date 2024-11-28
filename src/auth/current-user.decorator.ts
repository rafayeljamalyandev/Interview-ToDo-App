import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentUser = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);

const getCurrentUserByContext = (executionContext: ExecutionContext) => {
  return executionContext.switchToHttp().getRequest().user;
};
