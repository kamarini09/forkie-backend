import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  clerkUserId: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes?: Recipe[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites?: Favorite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
