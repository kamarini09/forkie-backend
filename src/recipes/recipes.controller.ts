import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { getAuth } from '@clerk/express';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  async create(@Body() dto: CreateRecipeDto, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);

    return this.recipesService.create(dto, clerkUserId!);
  }
}
