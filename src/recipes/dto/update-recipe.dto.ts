import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { RecipeContentDto } from './recipe-content.dto';

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecipeContentDto)
  content?: RecipeContentDto;

  @IsOptional()
  @IsInt()
  @Min(1)
  servings?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  prepMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cookMinutes?: number;

  @IsOptional()
  @IsString()
  parentRecipeId?: string;
}
