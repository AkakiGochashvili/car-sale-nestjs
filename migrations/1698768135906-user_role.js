const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UserRole1698768135906 {
    name = 'UserRole1698768135906'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'ADMIN'`);
    }
}
