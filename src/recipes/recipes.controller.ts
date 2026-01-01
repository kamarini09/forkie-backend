import {
  Body,
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { getAuth } from '@clerk/express';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesService } from './recipes.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  async create(@Body() dto: CreateRecipeDto, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.create(dto, clerkUserId!);
  }

  // Update (owner only)
  @UseGuards(ClerkAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
    @Req() req: Request,
  ) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.update(id, dto, clerkUserId!);
  }
  // Fork: creates a new recipe owned by current user
  // and sets parent_recipe_id to the original recipe id
  @UseGuards(ClerkAuthGuard)
  @Post(':id/fork')
  fork(@Param('id') id: string, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.fork(id, clerkUserId!);
  }

  // Get recipe (public OR owner can view private)
  // Also returns parent minimal info so UI can show "Forked from X"
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.getOneForView(id, clerkUserId ?? null);
  }

  @Get()
  listPublic() {
    return this.recipesService.listPublic();
  }

  // Get current user's recipes
  @UseGuards(ClerkAuthGuard)
  @Get('me/recipes')
  getUserRecipes(@Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.getUserRecipes(clerkUserId!);
  }
}
