import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from 'src/users/entities/user.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favRepo: Repository<Favorite>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Recipe) private readonly recipeRepo: Repository<Recipe>,
  ) {}

  // assumes you store clerk user id in users.clerkUserId
  private async getUserByClerkId(clerkUserId: string) {
    const user = await this.userRepo.findOne({ where: { clerkUserId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async add(clerkUserId: string, recipeId: string) {
    const user = await this.getUserByClerkId(clerkUserId);

    const exists = await this.recipeRepo.exist({ where: { id: recipeId } });
    if (!exists) throw new NotFoundException('Recipe not found');

    await this.favRepo.upsert({ userId: user.id, recipeId }, [
      'userId',
      'recipeId',
    ]);

    return { ok: true };
  }

  async remove(clerkUserId: string, recipeId: string) {
    const user = await this.getUserByClerkId(clerkUserId);
    await this.favRepo.delete({ userId: user.id, recipeId });
    return { ok: true };
  }

  async list(clerkUserId: string) {
    const user = await this.getUserByClerkId(clerkUserId);

    const favs = await this.favRepo.find({
      where: { userId: user.id },
      relations: { recipe: true },
      order: { createdAt: 'DESC' },
    });

    return favs.map((f) => ({
      favoritedAt: f.createdAt,
      recipe: f.recipe,
    }));
  }
}
