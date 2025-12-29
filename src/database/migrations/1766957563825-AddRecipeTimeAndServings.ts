import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecipeTimeAndServings1766957563825 implements MigrationInterface {
  name = 'AddRecipeTimeAndServings1766957563825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipes" ADD "servings" integer`);
    await queryRunner.query(`ALTER TABLE "recipes" ADD "prep_minutes" integer`);
    await queryRunner.query(`ALTER TABLE "recipes" ADD "cook_minutes" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "cook_minutes"`);
    await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "prep_minutes"`);
    await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "servings"`);
  }
}
