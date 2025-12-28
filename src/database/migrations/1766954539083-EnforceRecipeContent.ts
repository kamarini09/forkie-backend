import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceRecipeContent1766954539083 implements MigrationInterface {
  name = 'EnforceRecipeContent1766954539083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipes" ALTER COLUMN "content" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipes" ALTER COLUMN "content" DROP NOT NULL`,
    );
  }
}
