/*
  Warnings:

  - The values [OFFLIE] on the enum `STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_new" AS ENUM ('ONLINE', 'BUSY', 'DND', 'OFFLINE');
ALTER TABLE "Users" ALTER COLUMN "userStatus" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "userStatus" TYPE "STATUS_new" USING ("userStatus"::text::"STATUS_new");
ALTER TYPE "STATUS" RENAME TO "STATUS_old";
ALTER TYPE "STATUS_new" RENAME TO "STATUS";
DROP TYPE "STATUS_old";
ALTER TABLE "Users" ALTER COLUMN "userStatus" SET DEFAULT 'ONLINE';
COMMIT;
