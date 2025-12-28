import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentRecipeId1766954174574 implements MigrationInterface {
    name = 'AddParentRecipeId1766954174574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" ADD "parent_recipe_id" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_fa7885870916fb662c209ac9a6" ON "recipes" ("parent_recipe_id") `);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_fa7885870916fb662c209ac9a6c" FOREIGN KEY ("parent_recipe_id") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_fa7885870916fb662c209ac9a6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa7885870916fb662c209ac9a6"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "parent_recipe_id"`);
    }

}
