import { User } from 'src/users/entities/user.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('favorites')
@Index(['userId', 'recipeId'], { unique: true })
export class Favorite {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn('uuid', { name: 'recipe_id' })
  recipeId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
