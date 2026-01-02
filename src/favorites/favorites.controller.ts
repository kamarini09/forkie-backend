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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@ApiBearerAuth('clerk-auth')
@Controller('me/favorites')
@UseGuards(ClerkAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Get all favorites for current user' })
  @ApiResponse({ status: 200, description: 'Favorites retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'Add a recipe to favorites' })
  @ApiParam({ name: 'recipeId', description: 'Recipe UUID to favorite' })
  @ApiResponse({ status: 201, description: 'Recipe favorited successfully' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  @ApiResponse({ status: 409, description: 'Recipe already favorited' })
  @Post(':recipeId')
  async addFavorite(@Param('recipeId') recipeId: string, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.favoritesService.addFavorite(recipeId, clerkUserId!);
  }

  @ApiOperation({ summary: 'Remove a recipe from favorites' })
  @ApiParam({ name: 'recipeId', description: 'Recipe UUID to unfavorite' })
  @ApiResponse({ status: 200, description: 'Favorite removed successfully' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
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
