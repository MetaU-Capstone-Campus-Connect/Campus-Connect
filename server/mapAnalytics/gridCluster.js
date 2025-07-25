const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  convertBorder,
  createGrid,
  checkPointWithinBoundary,
  createClusters,
  getBiggestCluster,
  getCentroid,
  getLowestPopulation,
  groupUsersByGrid,
  mapBorder,
} = require("./utils");

router.get("/gridCluster", async (req, res) => {
  const locations = await prisma.map.findMany({
    where: { status: "ACTIVE" },
    select: {
      mapUserName: true,
      createTime: true,
      mapLat: true,
      mapLong: true,
    },
  });

  const border = convertBorder(mapBorder.polygon);
  const grid = createGrid(border);

  for (const loc of locations) {
    for (const cell of grid) {
      if (checkPointWithinBoundary(loc, cell)) {
        cell.count += 1;
      }
    }
  }

  const clusters = createClusters(grid);
  const biggestCluster = getBiggestCluster(clusters);
  const lowestPopulatedLocation = getLowestPopulation(grid, clusters);
  const highestPopulatedLocation = getCentroid(biggestCluster);
  const groupedMarkers = groupUsersByGrid(locations, grid);

  res.json({
    highestPopulated: highestPopulatedLocation,
    leastPopulated: lowestPopulatedLocation,
    biggestCluster,
    groupedMarkers,
  });
});

module.exports = router;
