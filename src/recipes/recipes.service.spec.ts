import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { UsersService } from '../users/users.service';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

describe('RecipesService', () => {
  let service: RecipesService;
  let mockRecipesRepo: any;
  let mockUsersService: any;
  let mockFavoritesService: any;

  beforeEach(async () => {
    // Arrange: Create mock implementations
    mockRecipesRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      exist: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockUsersService = { findOrCreateByClerkId: jest.fn() };
    mockFavoritesService = { isFavorited: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: getRepositoryToken(Recipe), useValue: mockRecipesRepo },
        { provide: UsersService, useValue: mockUsersService },
        { provide: FavoritesService, useValue: mockFavoritesService },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a recipe successfully', async () => {
      // Arrange
      const clerkUserId = 'clerk_user123';
      const mockUser = { id: 'db-user-id-1' };
      const createDto: CreateRecipeDto = {
        title: 'Chocolate Cake',
        content: {
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cup' }],
          steps: [{ order: 1, text: 'Mix ingredients' }],
        },
      };
      const expectedRecipe = {
        id: 'recipe-uuid-1',
        ...createDto,
        userId: mockUser.id,
      };
      mockUsersService.findOrCreateByClerkId.mockResolvedValue(mockUser);
      mockRecipesRepo.create.mockReturnValue(expectedRecipe);
      mockRecipesRepo.save.mockResolvedValue(expectedRecipe);
      // Act
      const result = await service.create(createDto, clerkUserId);
      // Assert
      expect(result).toEqual(expectedRecipe);
      expect(mockRecipesRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when parent recipe does not exist', async () => {
      // Arrange
      const clerkUserId = 'clerk_user123';
      const mockUser = { id: 'db-user-id-1' };
      const createDto: CreateRecipeDto = {
        title: 'Forked Recipe',
        content: {
          ingredients: [],
          steps: [{ order: 1, text: 'Sample step' }],
        },
        parentRecipeId: 'non-existent-parent',
      };

      mockUsersService.findOrCreateByClerkId.mockResolvedValue(mockUser);
      mockRecipesRepo.exist.mockResolvedValue(false);

      // Act & Assert
      await expect(service.create(createDto, clerkUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRecipesRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update recipe when user is owner', async () => {
      // Arrange
      const recipeId = 'recipe-123';
      const clerkUserId = 'clerk_user123';
      const mockUser = { id: 'db-user-id-1' };
      const existingRecipe = {
        id: recipeId,
        userId: mockUser.id,
        title: 'Old Title',
      };
      const updateDto: UpdateRecipeDto = { title: 'New Title' };

      mockUsersService.findOrCreateByClerkId.mockResolvedValue(mockUser);
      mockRecipesRepo.findOne.mockResolvedValue(existingRecipe);
      mockRecipesRepo.save.mockResolvedValue({
        ...existingRecipe,
        ...updateDto,
      });

      // Act
      const result = await service.update(recipeId, updateDto, clerkUserId);

      // Assert
      expect(result.title).toBe('New Title');
      expect(mockRecipesRepo.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      // Arrange
      const recipeId = 'recipe-123';
      const clerkUserId = 'clerk_user123';
      const mockUser = { id: 'db-user-id-1' };
      const existingRecipe = {
        id: recipeId,
        userId: 'different-user-id',
        title: 'Recipe Title',
      };
      const updateDto: UpdateRecipeDto = { title: 'New Title' };

      mockUsersService.findOrCreateByClerkId.mockResolvedValue(mockUser);
      mockRecipesRepo.findOne.mockResolvedValue(existingRecipe);

      // Act & Assert
      await expect(
        service.update(recipeId, updateDto, clerkUserId),
      ).rejects.toThrow(ForbiddenException);
      expect(mockRecipesRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('fork', () => {
    it('should fork a public recipe successfully', async () => {
      // Arrange
      const originalRecipeId = 'original-recipe-123';
      const clerkUserId = 'clerk_user456';
      const mockUser = { id: 'db-user-id-2' };
      const originalRecipe = {
        id: originalRecipeId,
        userId: 'db-user-id-1',
        title: 'Original Recipe',
        isPublic: true,
        content: { ingredients: [], steps: [{ order: 1, text: 'Mix' }] },
      };
      const forkedRecipe = {
        id: 'forked-recipe-456',
        userId: mockUser.id,
        parentRecipeId: originalRecipeId,
        title: originalRecipe.title,
        isPublic: false,
      };

      mockUsersService.findOrCreateByClerkId.mockResolvedValue(mockUser);
      mockRecipesRepo.findOne.mockResolvedValue(originalRecipe);
      mockRecipesRepo.create.mockReturnValue(forkedRecipe);
      mockRecipesRepo.save.mockResolvedValue(forkedRecipe);

      // Act
      const result = await service.fork(originalRecipeId, clerkUserId);

      // Assert
      expect(result.parentRecipeId).toBe(originalRecipeId);
      expect(result.isPublic).toBe(false);
    });

    it('should throw ForbiddenException when trying to fork private recipe', async () => {
      // Arrange
      const originalRecipeId = 'private-recipe-123';
      const clerkUserId = 'clerk_user456';
      const mockUser = { id: 'db-user-id-2' };
      const originalRecipe = {
        id: originalRecipeId,
        userId: 'db-user-id-1',
        title: 'Private Recipe',
        isPublic: false,
      };

      mockUsersService.findOrCreateByClerkId.mockResolvedValue(mockUser);
      mockRecipesRepo.findOne.mockResolvedValue(originalRecipe);

      // Act & Assert
      await expect(service.fork(originalRecipeId, clerkUserId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockRecipesRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('getOneForView', () => {
    it('should return public recipe', async () => {
      // Arrange
      const recipeId = 'recipe-123';
      const mockRecipe = {
        id: recipeId,
        title: 'Public Recipe',
        isPublic: true,
        user: { clerkUserId: 'clerk_owner123' },
        parentRecipe: null,
      };

      mockRecipesRepo.findOne.mockResolvedValue(mockRecipe);

      // Act
      const result = await service.getOneForView(recipeId, null);

      // Assert
      expect(result.id).toBe(recipeId);
      expect(result.isFavorited).toBe(false);
    });

    it('should throw ForbiddenException for private recipe', async () => {
      // Arrange
      const mockRecipe = {
        id: 'recipe-123',
        userId: 'db-user-id-1',
        isPublic: false,
      };

      mockRecipesRepo.findOne.mockResolvedValue(mockRecipe);

      // Act & Assert
      await expect(service.getOneForView('recipe-123', null)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('listPublic', () => {
    it('should return all public recipes', async () => {
      // Arrange
      const mockRecipes = [
        {
          id: 'recipe-1',
          title: 'Recipe 1',
          isPublic: true,
          user: { clerkUserId: 'clerk_user1' },
          parentRecipe: null,
        },
      ];

      mockRecipesRepo.find.mockResolvedValue(mockRecipes);

      // Act
      const result = await service.listPublic();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('recipe-1');
    });
  });

  describe('getUserRecipes', () => {
    it('should return all user recipes', async () => {
      // Arrange
      const clerkUserId = 'clerk_user123';
      const mockUser = { id: 'db-user-id-1' };
      const mockRecipes = [
        {
          id: 'recipe-1',
          userId: mockUser.id,
          title: 'My Recipe',
          isPublic: true,
          user: { clerkUserId: clerkUserId },
          parentRecipe: null,
        },
      ];

      mockUsersService.findOrCreateByClerkId.mockResolvedValue(mockUser);
      mockRecipesRepo.find.mockResolvedValue(mockRecipes);

      // Act
      const result = await service.getUserRecipes(clerkUserId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('recipe-1');
    });
  });
});
