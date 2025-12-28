import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedJSONRecipeContent1766949959078 implements MigrationInterface {
  name = 'AddedJSONRecipeContent1766949959078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipes" ADD "content" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "content"`);
  }
}
