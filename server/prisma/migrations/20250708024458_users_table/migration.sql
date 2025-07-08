/*
  Warnings:

  - You are about to drop the `_UserGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RANK" AS ENUM ('ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_B_fkey";

-- DropTable
DROP TABLE "_UserGroups";

-- CreateTable
CREATE TABLE "GroupMembers" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "rank" "RANK" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "GroupMembers_pkey" PRIMARY KEY ("userId","groupId")
);

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Groups"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;
