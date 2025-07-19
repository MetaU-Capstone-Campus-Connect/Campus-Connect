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
const COLS = 20;
const ROWS = 20;

router.post("/checkCellLocation", async (req, res) => {
  try {
    const { mapLat, mapLong } = req.body;
    const clickedPoint = { mapLat, mapLong };
    const border = convertBorder(mapBorder.polygon);
    const grid = createGrid(border);

    const locations = await prisma.map.findMany({
      where: { status: "PAST" },
    });

    for (const loc of locations) {
      for (const cell of grid) {
        if (checkPoint(loc, cell)) {
          cell.count += 1;
        }
      }
    }
    const matchingCell = grid.find((cell) => checkPoint(clickedPoint, cell));
    const neighbors = getNeighborIndices(matchingCell);
    const allCells = [
      matchingCell,
      ...neighbors.map(({ row, col }) => grid[row * COLS + col]),
    ];
    const totalCount = allCells.reduce(
      (sum, cell) => sum + (cell.count || 0), 0);

    console.log(matchingCell);
    console.log("nieghbor cells", allCells);
    console.log("count", totalCount);
    console.log("size", locations.length);
    console.log("percentage", totalCount / locations.length);

    res.json({
      matchingCell,
      neighborCells: allCells,
      totalCount,
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
