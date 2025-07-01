-- CreateTable
CREATE TABLE "Map" (
    "mapId" SERIAL NOT NULL,
    "mapUserName" TEXT NOT NULL,
    "mapLong" DOUBLE PRECISION NOT NULL,
    "mapLat" DOUBLE PRECISION NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("mapId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Map_mapUserName_key" ON "Map"("mapUserName");
