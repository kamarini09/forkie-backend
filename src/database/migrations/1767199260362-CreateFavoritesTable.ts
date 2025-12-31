import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoritesTable1767199260362 implements MigrationInterface {
  name = 'CreateFavoritesTable1767199260362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorites" ("user_id" uuid NOT NULL, "recipe_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_833a2c29bdd2e66eb4edd8e1b10" PRIMARY KEY ("user_id", "recipe_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_833a2c29bdd2e66eb4edd8e1b1" ON "favorites" ("user_id", "recipe_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_833a2c29bdd2e66eb4edd8e1b1"`,
    );
    await queryRunner.query(`DROP TABLE "favorites"`);
  }
}
