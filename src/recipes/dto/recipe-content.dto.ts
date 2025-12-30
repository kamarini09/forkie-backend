import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

const UNIT_OPTIONS = [
  'gr',
  'kg',
  'ml',
  'l',
  'tsp',
  'tbsp',
  'cup',
  'pcs',
  'pinch',
  'clove',
  'slice',
] as const;

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsIn(UNIT_OPTIONS, {
    message: `unit must be one of: ${UNIT_OPTIONS.join(', ')}`,
  })
  unit?: (typeof UNIT_OPTIONS)[number];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}

export class StepDto {
  @IsInt()
  @Min(1)
  order: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class RecipeContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps: StepDto[];
}
