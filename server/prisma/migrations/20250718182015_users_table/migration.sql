-- CreateEnum
CREATE TYPE "MAPSTATUS" AS ENUM ('ACTIVE', 'PAST');

-- DropIndex
DROP INDEX "Map_mapUserName_key";

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "status" "MAPSTATUS" NOT NULL DEFAULT 'ACTIVE';
