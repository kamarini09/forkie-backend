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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'Ingredient name', example: 'Spaghetti' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Quantity amount',
    example: 400,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Unit of measurement',
    example: 'gr',
    enum: UNIT_OPTIONS,
  })
  @IsOptional()
  @IsIn(UNIT_OPTIONS, {
    message: `unit must be one of: ${UNIT_OPTIONS.join(', ')}`,
  })
  unit?: (typeof UNIT_OPTIONS)[number];

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'fresh or dried',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}

export class StepDto {
  @ApiProperty({ description: 'Step order number', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({
    description: 'Step instructions',
    example: 'Boil water in a large pot',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class RecipeContentDto {
  @ApiProperty({
    description: 'List of ingredients',
    type: [IngredientDto],
    example: [
      { name: 'Spaghetti', quantity: 400, unit: 'gr' },
      { name: 'Eggs', quantity: 4, unit: 'pcs' },
      { name: 'Parmesan cheese', quantity: 100, unit: 'gr', note: 'grated' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @ApiProperty({
    description: 'Ordered list of cooking steps',
    type: [StepDto],
    example: [
      { order: 1, text: 'Boil water in a large pot' },
      { order: 2, text: 'Cook spaghetti according to package instructions' },
      { order: 3, text: 'Beat eggs with grated parmesan' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps: StepDto[];
}
