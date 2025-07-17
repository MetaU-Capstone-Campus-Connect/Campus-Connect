const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  convertBorder,
  createGrid,
  checkPoint,
  createClusters,
  getBiggestCluster,
  getCentroid,
  getLowestPopulation,
} = require("./utils");

const mapBorder = {
  polygon: [
    { lat: 37.48188439982738, lng: -122.15137870228908 },
    { lat: 37.480519446100864, lng: -122.15077332026456 },
    { lat: 37.47982552151212, lng: -122.16782010873156 },
    { lat: 37.48215891264268, lng: -122.16750300387568 },
  ],
};

router.get("/gridCluster", async (req, res) => {
  const locations = await prisma.map.findMany({
    select: {
      mapLat: true,
      mapLong: true,
    },
  });

  const border = convertBorder(mapBorder.polygon);
  const grid = createGrid(border);

  for (const loc of locations) {
    for (const cell of grid) {
      if (checkPoint(loc, cell)) {
        cell.count += 1;
      }
    }
  }

  const clusters = createClusters(grid);
  const biggestCluster = getBiggestCluster(clusters);
  const lowestPopulatedLocation = getLowestPopulation(grid, clusters);
  const highestPopulatedLocation = getCentroid(biggestCluster);

  res.json({
    highestPopulated: highestPopulatedLocation,
    leastPopulated: lowestPopulatedLocation,
    clusters: clusters,
    grid: grid,
  });
});

module.exports = router;