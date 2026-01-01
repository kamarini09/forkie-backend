import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Recipe]), UsersModule],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService, TypeOrmModule],
})
export class FavoritesModule {}
