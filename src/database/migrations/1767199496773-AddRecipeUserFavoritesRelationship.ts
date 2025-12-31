import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecipeUserFavoritesRelationship1767199496773 implements MigrationInterface {
  name = 'AddRecipeUserFavoritesRelationship1767199496773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_f013a5737104974aa8b57163708" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_f013a5737104974aa8b57163708"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`,
    );
  }
}
