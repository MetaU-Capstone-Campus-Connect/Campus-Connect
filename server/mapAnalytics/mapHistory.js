const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  convertBorder,
  createGrid,
  checkPoint,
  getNeighborIndices,
} = require("./utils");

const mapBorder = {
  polygon: [
    { lat: 37.48188439982738, lng: -122.15137870228908 },
    { lat: 37.480519446100864, lng: -122.15077332026456 },
    { lat: 37.47982552151212, lng: -122.16782010873156 },
    { lat: 37.48215891264268, lng: -122.16750300387568 },
  ],
};

router.post("/checkCellLocation", async (req, res) => {
  const COLS = 20;
  try {
    const { mapLat, mapLong } = req.body;
    const clickedPoint = { mapLat, mapLong };
    const border = convertBorder(mapBorder.polygon);
    const grid = createGrid(border);
    const dayCounts = Array(7).fill(0);

    const locations = await prisma.map.findMany({
      where: { status: "PAST" },
    });

    for (const loc of locations) {
      const date = new Date(loc.createTime);
      const day = date.getUTCDay();

      for (const cell of grid) {
        if (checkPoint(loc, cell)) {
          cell.totalCount += 1;
          if (!cell.totalLocations) cell.totalLocations = [];
          cell.totalLocations.push(loc);
          if (checkPoint(clickedPoint, cell)) {
            dayCounts[day]++;
          }
          break;
        }
      }
    }

    const matchingCell = grid.find((cell) => checkPoint(clickedPoint, cell));
    const neighbors = getNeighborIndices(matchingCell);
    const allCells = [
      matchingCell,
      ...neighbors.map(({ row, col }) => grid[row * COLS + col]),
    ];

    const overallTotalCount = locations.filter((loc) =>
      allCells.some((cell) => checkPoint(loc, cell))
    ).length;

    res.json({
      percentage: overallTotalCount / locations.length,
      dayCounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error: Checking the cell for clicked point",
      error,
    });
  }
});

module.exports = router;
