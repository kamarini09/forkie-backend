import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('recipes/:id/favorite')
  add(@Param('id') recipeId: string, @Req() req: any) {
    const clerkUserId = req.auth?.userId; // adjust if your Clerk guard uses a different field
    return this.favoritesService.add(clerkUserId, recipeId);
  }

  @Delete('recipes/:id/favorite')
  remove(@Param('id') recipeId: string, @Req() req: any) {
    const clerkUserId = req.auth?.userId;
    return this.favoritesService.remove(clerkUserId, recipeId);
  }

  @Get('me/favorites')
  list(@Req() req: any) {
    const clerkUserId = req.auth?.userId;
    return this.favoritesService.list(clerkUserId);
  }
}
