import { MigrationInterface, QueryRunner } from 'typeorm';

export class Action1589173721349 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "action" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "changed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "active" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "action"`, undefined);
    }
}
