import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecipeContentDto } from './recipe-content.dto';

export class CreateRecipeDto {
  @ApiProperty({
    description: 'Recipe title',
    example: 'Classic Spaghetti Carbonara',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Recipe description',
    example: 'A traditional Italian pasta dish',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the recipe is public',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description: 'Recipe ingredients and steps',
    type: RecipeContentDto,
  })
  @ValidateNested()
  @Type(() => RecipeContentDto)
  content: RecipeContentDto;

  @ApiPropertyOptional({
    description: 'Number of servings',
    example: 4,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  servings?: number;

  @ApiPropertyOptional({
    description: 'Preparation time in minutes',
    example: 15,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  prepMinutes?: number;

  @ApiPropertyOptional({
    description: 'Cooking time in minutes',
    example: 20,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cookMinutes?: number;

  @ApiPropertyOptional({
    description: 'Parent recipe UUID if this is a fork',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  parentRecipeId?: string;
}
