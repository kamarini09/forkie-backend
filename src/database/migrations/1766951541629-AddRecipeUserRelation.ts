import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecipeUserRelation1766951541629 implements MigrationInterface {
  name = 'AddRecipeUserRelation1766951541629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipes" ADD "user_id" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_67d98fd6ff56c4340a81140215" ON "recipes" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_67d98fd6ff56c4340a811402154" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recipes" DROP CONSTRAINT "FK_67d98fd6ff56c4340a811402154"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67d98fd6ff56c4340a81140215"`,
    );
    await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "user_id"`);
  }
}
