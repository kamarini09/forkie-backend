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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesService } from './recipes.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('clerk-auth')
  @UseGuards(ClerkAuthGuard)
  @Post()
  async create(@Body() dto: CreateRecipeDto, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.create(dto, clerkUserId!);
  }

  // Update (owner only)
  @ApiOperation({ summary: 'Update a recipe (owner only)' })
  @ApiParam({ name: 'id', description: 'Recipe UUID' })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  @ApiBearerAuth('clerk-auth')
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
  @ApiOperation({ summary: 'Fork an existing recipe' })
  @ApiParam({ name: 'id', description: 'Recipe UUID to fork' })
  @ApiResponse({ status: 201, description: 'Recipe forked successfully' })
  @ApiResponse({ status: 404, description: 'Original recipe not found' })
  @ApiBearerAuth('clerk-auth')
  @UseGuards(ClerkAuthGuard)
  @Post(':id/fork')
  fork(@Param('id') id: string, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.fork(id, clerkUserId!);
  }

  // Get recipe (public OR owner can view private)
  // Also returns parent minimal info so UI can show "Forked from X"
  @ApiOperation({ summary: 'Get a recipe by ID' })
  @ApiParam({ name: 'id', description: 'Recipe UUID' })
  @ApiResponse({ status: 200, description: 'Recipe retrieved successfully' })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found or not accessible',
  })
  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.getOneForView(id, clerkUserId ?? null);
  }

  @ApiOperation({ summary: 'List all public recipes' })
  @ApiResponse({
    status: 200,
    description: 'Public recipes retrieved successfully',
  })
  @Get()
  listPublic() {
    return this.recipesService.listPublic();
  }

  // Get current user's recipes
  @ApiOperation({ summary: "Get current user's recipes" })
  @ApiResponse({
    status: 200,
    description: 'User recipes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('clerk-auth')
  @UseGuards(ClerkAuthGuard)
  @Get('me/recipes')
  getUserRecipes(@Req() req: Request) {
    const { userId: clerkUserId } = getAuth(req);
    return this.recipesService.getUserRecipes(clerkUserId!);
  }
}
