/*
  Warnings:

  - A unique constraint covering the columns `[mapUserName]` on the table `Map` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Map_mapUserName_key" ON "Map"("mapUserName");
