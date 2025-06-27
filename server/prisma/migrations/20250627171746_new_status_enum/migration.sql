/*
  Warnings:

  - The `userStatus` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ONLINE', 'BUSY', 'DND', 'OFFLIE');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "userStatus",
ADD COLUMN     "userStatus" "STATUS" NOT NULL DEFAULT 'ONLINE';
