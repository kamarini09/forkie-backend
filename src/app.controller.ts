import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { getAuth } from '@clerk/express';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async me(@Req() req: Request) {
    const auth = getAuth(req);

    const dbUser = await this.usersService.findOrCreateByClerkId({
      clerkUserId: auth.userId!,
      // we’ll fill these properly in the next step
    });

    return {
      clerkUserId: auth.userId,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
      },
    };
  }
}
