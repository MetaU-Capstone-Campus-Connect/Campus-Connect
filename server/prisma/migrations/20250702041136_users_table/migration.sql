/*
  Warnings:

  - You are about to drop the `_GroupsToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupsToUsers" DROP CONSTRAINT "_GroupsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupsToUsers" DROP CONSTRAINT "_GroupsToUsers_B_fkey";

-- DropTable
DROP TABLE "_GroupsToUsers";

-- CreateTable
CREATE TABLE "_GroupMember" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupMember_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GroupMember_B_index" ON "_GroupMember"("B");

-- AddForeignKey
ALTER TABLE "_GroupMember" ADD CONSTRAINT "_GroupMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMember" ADD CONSTRAINT "_GroupMember_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
