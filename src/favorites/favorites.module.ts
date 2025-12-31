import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { User } from 'src/users/entities/user.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Recipe])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [TypeOrmModule],
})
export class FavoritesModule {}
