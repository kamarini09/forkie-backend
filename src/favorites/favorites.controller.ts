import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@Controller()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(ClerkAuthGuard)
  @Post('recipes/:id/favorite')
  add(@Param('id') recipeId: string, @Req() req: any) {
    const clerkUserId = req.auth?.userId; // adjust if your Clerk guard uses a different field
    return this.favoritesService.add(clerkUserId, recipeId);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete('recipes/:id/favorite')
  remove(@Param('id') recipeId: string, @Req() req: any) {
    const clerkUserId = req.auth?.userId;
    return this.favoritesService.remove(clerkUserId, recipeId);
  }

  @UseGuards(ClerkAuthGuard)
  @Get('me/favorites')
  list(@Req() req: any) {
    const clerkUserId = req.auth?.userId;
    return this.favoritesService.list(clerkUserId);
  }
}
