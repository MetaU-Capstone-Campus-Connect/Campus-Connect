/*
  Warnings:

  - You are about to drop the column `accountData` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "accountData",
ADD COLUMN     "accountDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userBio" TEXT,
ADD COLUMN     "userProfileBanner" TEXT,
ADD COLUMN     "userProfileImg" TEXT,
ADD COLUMN     "userStatus" TEXT;
