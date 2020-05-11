import { MigrationInterface, QueryRunner } from 'typeorm';

export class Budget1589173772553 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "budget" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, CONSTRAINT "UQ_06fed523161c799f417d53482a4" UNIQUE ("title"), CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "date" date NOT NULL, "amount" bigint NOT NULL, "currencyCode" text NOT NULL, "accountId" uuid, CONSTRAINT "UQ_525cb62e4cdd3364bd031de0969" UNIQUE ("title"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "budgetId" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_3d6e89b14baa44a71870450d14d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_4f5278cf08fcbfe9b77f5d6a17f" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "account" DROP CONSTRAINT "FK_4f5278cf08fcbfe9b77f5d6a17f"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_3d6e89b14baa44a71870450d14d"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "account"`, undefined);
        await queryRunner.query(`DROP TABLE "transaction"`, undefined);
        await queryRunner.query(`DROP TABLE "budget"`, undefined);
    }
}
