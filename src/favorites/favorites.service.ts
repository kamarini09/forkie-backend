import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { UsersService } from '../users/users.service';
import { Recipe } from '../recipes/entities/recipe.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepo: Repository<Favorite>,
    @InjectRepository(Recipe)
    private readonly recipesRepo: Repository<Recipe>,
    private readonly usersService: UsersService,
  ) {}

  async addFavorite(recipeId: string, clerkUserId: string): Promise<Favorite> {
    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);

    // Check if recipe exists
    const recipe = await this.recipesRepo.findOne({
      where: { id: recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    // Check if already favorited
    const existing = await this.favoritesRepo.findOne({
      where: {
        userId: user.id,
        recipeId: recipeId,
      },
    });
    if (existing) {
      throw new ConflictException('Recipe already favorited');
    }

    const favorite = this.favoritesRepo.create({
      userId: user.id,
      recipeId: recipeId,
    });

    return this.favoritesRepo.save(favorite);
  }

  async removeFavorite(recipeId: string, clerkUserId: string): Promise<void> {
    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);

    const result = await this.favoritesRepo.delete({
      userId: user.id,
      recipeId: recipeId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Favorite not found');
    }
  }

  async getUserFavorites(clerkUserId: string): Promise<Favorite[]> {
    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);

    return this.favoritesRepo.find({
      where: { userId: user.id },
      relations: ['recipe', 'recipe.user', 'recipe.parentRecipe'],
      order: { createdAt: 'DESC' },
    });
  }

  async isFavorited(
    recipeId: string,
    clerkUserId: string | null,
  ): Promise<boolean> {
    if (!clerkUserId) return false;

    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);

    const favorite = await this.favoritesRepo.findOne({
      where: {
        userId: user.id,
        recipeId: recipeId,
      },
    });

    return !!favorite;
  }
}
