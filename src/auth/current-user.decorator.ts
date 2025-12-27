import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getAuth } from '@clerk/express';
import type { Request } from 'express';

export const CurrentClerkUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const { userId } = getAuth(req);
    return userId ?? null;
  },
);
