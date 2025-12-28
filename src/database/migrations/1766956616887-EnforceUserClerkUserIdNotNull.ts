import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceUserClerkUserIdNotNull1766956616887 implements MigrationInterface {
  name = 'EnforceUserClerkUserIdNotNull1766956616887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "clerkUserId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "clerkUserId" DROP NOT NULL`,
    );
  }
}
