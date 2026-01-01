import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { getAuth } from '@clerk/express';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { FavoritesService } from './favorites.service';

@Controller('me/favorites')
@UseGuards(ClerkAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getUserFavorites(@Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    const favorites = await this.favoritesService.getUserFavorites(
      clerkUserId!,
    );

    // Transform to match frontend expected format
    return favorites.map((fav) => ({
      favoritedAt: fav.createdAt,
      recipe: fav.recipe,
    }));
  }

  @Post(':recipeId')
  async addFavorite(@Param('recipeId') recipeId: string, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.favoritesService.addFavorite(recipeId, clerkUserId!);
  }

  @Delete(':recipeId')
  async removeFavorite(
    @Param('recipeId') recipeId: string,
    @Req() req: Request,
  ) {
    const { userId: clerkUserId } = getAuth(req);
    await this.favoritesService.removeFavorite(recipeId, clerkUserId!);
    return { message: 'Favorite removed successfully' };
  }
}
