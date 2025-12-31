import { CreateDateColumn, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity('favorites')
@Index(['userId', 'recipeId'], { unique: true })
export class Favorite {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @PrimaryColumn('uuid', { name: 'recipe_id' })
  recipeId: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
