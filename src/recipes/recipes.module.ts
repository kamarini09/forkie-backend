import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { UsersModule } from '../users/users.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), UsersModule, FavoritesModule],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [TypeOrmModule],
})
export class RecipesModule {}
