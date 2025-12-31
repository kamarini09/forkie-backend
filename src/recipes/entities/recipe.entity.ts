import { Favorite } from 'src/favorites/entities/favorite.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type RecipeContent = {
  ingredients: Array<{
    name: string;
    quantity?: number;
    unit?: string;
    note?: string;
  }>;
  steps: Array<{
    order: number;
    text: string;
  }>;
};

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;
  @Column({ type: 'jsonb' })
  content: RecipeContent;

  @Column({ type: 'int', nullable: true })
  servings?: number;

  @Column({ type: 'int', name: 'prep_minutes', nullable: true })
  prepMinutes?: number;

  @Column({ type: 'int', name: 'cook_minutes', nullable: true })
  cookMinutes?: number;

  @Index()
  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Index()
  @Column({ type: 'uuid', name: 'parent_recipe_id', nullable: true })
  parentRecipeId?: string;

  @ManyToOne(() => Recipe, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'parent_recipe_id' })
  parentRecipe?: Recipe;

  @OneToMany(() => Favorite, (favorite) => favorite.recipe)
  favorites?: Favorite[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
