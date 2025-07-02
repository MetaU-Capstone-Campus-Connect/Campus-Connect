-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "groupsGroupId" INTEGER;

-- CreateTable
CREATE TABLE "Groups" (
    "groupId" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,
    "groupInfo" TEXT NOT NULL,
    "groupImg" TEXT NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("groupId")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_groupsGroupId_fkey" FOREIGN KEY ("groupsGroupId") REFERENCES "Groups"("groupId") ON DELETE SET NULL ON UPDATE CASCADE;
