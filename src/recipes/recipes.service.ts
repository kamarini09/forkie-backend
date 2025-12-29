import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepo: Repository<Recipe>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateRecipeDto, clerkUserId: string): Promise<Recipe> {
    // 1) Ensure we have a local DB user row for this Clerk user
    const user = await this.usersService.findOrCreateByClerkId(clerkUserId);

    // 2) Optional: validate parentRecipeId exists (forking)
    if (dto.parentRecipeId) {
      const parentExists = await this.recipesRepo.exist({
        where: { id: dto.parentRecipeId },
      });
      if (!parentExists) throw new NotFoundException('Parent recipe not found');
    }

    // 3) Create the recipe row
    const recipe = this.recipesRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      isPublic: dto.isPublic ?? true,
      content: dto.content, // JSONB (validated by DTO)
      userId: user.id, // FK to users.id
      parentRecipeId: dto.parentRecipeId ?? null,
    });

    // 4) Save to DB
    return this.recipesRepo.save(recipe);
  }
}
