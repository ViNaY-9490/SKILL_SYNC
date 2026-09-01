import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Extracts the authenticated user from the JWT-validated request
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
