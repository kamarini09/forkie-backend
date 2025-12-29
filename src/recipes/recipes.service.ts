import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UsersService } from '../users/users.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepo: Repository<Recipe>,
    private readonly usersService: UsersService,
  ) {}

  private async getDbUserIdOrNull(clerkUserId: string | null) {
    if (!clerkUserId) return null;
    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);
    return user.id;
  }

  private async assertOwner(
    recipeId: string,
    dbUserId: string,
  ): Promise<Recipe> {
    const recipe = await this.recipesRepo.findOne({ where: { id: recipeId } });
    if (!recipe) throw new NotFoundException('Recipe not found');
    if (recipe.userId !== dbUserId)
      throw new ForbiddenException('Not your recipe');
    return recipe;
  }

  async create(dto: CreateRecipeDto, clerkUserId: string): Promise<Recipe> {
    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);

    // Optional: if you allow parentRecipeId on create, validate it exists
    if (dto.parentRecipeId) {
      const parentExists = await this.recipesRepo.exist({
        where: { id: dto.parentRecipeId },
      });
      if (!parentExists) throw new NotFoundException('Parent recipe not found');
    }

    const recipe = this.recipesRepo.create({
      userId: user.id,
      title: dto.title,
      description: dto.description ?? null,
      isPublic: dto.isPublic ?? true,
      content: dto.content,
      servings: dto.servings ?? null,
      prepMinutes: dto.prepMinutes ?? null,
      cookMinutes: dto.cookMinutes ?? null,
      parentRecipeId: dto.parentRecipeId ?? null,
    });

    return this.recipesRepo.save(recipe);
  }

  async update(
    recipeId: string,
    dto: UpdateRecipeDto,
    clerkUserId: string,
  ): Promise<Recipe> {
    const dbUserId = await this.getDbUserIdOrNull(clerkUserId);
    if (!dbUserId) throw new ForbiddenException('Not authenticated');

    const recipe = await this.assertOwner(recipeId, dbUserId);

    // PATCH semantics: update only provided fields
    if (dto.title !== undefined) recipe.title = dto.title;
    if (dto.description !== undefined)
      recipe.description = dto.description ?? null;
    if (dto.isPublic !== undefined) recipe.isPublic = dto.isPublic;
    if (dto.content !== undefined) recipe.content = dto.content;

    if (dto.servings !== undefined) recipe.servings = dto.servings ?? null;
    if (dto.prepMinutes !== undefined)
      recipe.prepMinutes = dto.prepMinutes ?? null;
    if (dto.cookMinutes !== undefined)
      recipe.cookMinutes = dto.cookMinutes ?? null;

    return this.recipesRepo.save(recipe);
  }

  async fork(originalRecipeId: string, clerkUserId: string): Promise<Recipe> {
    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);

    const original = await this.recipesRepo.findOne({
      where: { id: originalRecipeId },
    });
    if (!original) throw new NotFoundException('Recipe not found');

    // Rule: can fork public recipes OR your own private recipe
    const canView = original.isPublic === true || original.userId === user.id;

    if (!canView) throw new ForbiddenException('Cannot fork a private recipe');

    const forked = this.recipesRepo.create({
      userId: user.id,
      parentRecipeId: original.id,

      // copy fields
      title: original.title,
      description: original.description ?? null,
      isPublic: false, // common default: forks start private
      content: original.content,
      servings: original.servings ?? null,
      prepMinutes: original.prepMinutes ?? null,
      cookMinutes: original.cookMinutes ?? null,
    });

    return this.recipesRepo.save(forked);
  }

  async getOneForView(recipeId: string, clerkUserId: string | null) {
    const dbUserId = await this.getDbUserIdOrNull(clerkUserId);

    // Load parent recipe too, so UI can show "Forked from ..."
    // We only need parent id + title, but simplest is to load relation and return a shaped response.
    const recipe = await this.recipesRepo.findOne({
      where: { id: recipeId },
      relations: { parentRecipe: true },
    });

    if (!recipe) throw new NotFoundException('Recipe not found');

    const canView =
      recipe.isPublic === true || (dbUserId && recipe.userId === dbUserId);
    if (!canView) throw new ForbiddenException('Recipe is private');

    // Return a UI-friendly shape (so you don’t leak full parent content)
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      isPublic: recipe.isPublic,
      content: recipe.content,
      servings: recipe.servings,
      prepMinutes: recipe.prepMinutes,
      cookMinutes: recipe.cookMinutes,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,

      forkedFrom: recipe.parentRecipe
        ? { id: recipe.parentRecipe.id, title: recipe.parentRecipe.title }
        : null,
    };
  }
  async listPublic() {
    const recipes = await this.recipesRepo.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
      relations: { parentRecipe: true }, // so we can show "forked from" if you want
    });

    // Return a light “summary” for the grid (no need to send full content)
    return recipes.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      isPublic: r.isPublic,
      servings: r.servings,
      prepMinutes: r.prepMinutes,
      cookMinutes: r.cookMinutes,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      forkedFrom: r.parentRecipe
        ? { id: r.parentRecipe.id, title: r.parentRecipe.title }
        : null,
    }));
  }
}
