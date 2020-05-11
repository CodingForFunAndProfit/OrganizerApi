import { MigrationInterface, QueryRunner } from 'typeorm';

export class Subscriptions1589173556293 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subscription" jsonb NOT NULL, "userId" uuid, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "subscription"`, undefined);
    }
}
