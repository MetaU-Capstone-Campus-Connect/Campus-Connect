const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { convertBorder, createGrid, checkPoint } = require("./utils");

const mapBorder = {
  polygon: [
    { lat: 7.48177726883968, lng: -122.15139858150746 },
    { lat: 37.48072367834857, lng: -122.15104591426888 },
    { lat: 37.4792209529839, lng: -122.17215864667745 },
    { lat: 37.48501306933228, lng: -122.17409384284025 },
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

  res.json(grid);
});

module.exports = router;