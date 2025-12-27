import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { getAuth } from '@clerk/express';
import type { Request } from 'express';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  me(@Req() req: Request) {
    const auth = getAuth(req);
    return { clerkUserId: auth.userId };
  }
}
