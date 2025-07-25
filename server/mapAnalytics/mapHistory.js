const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  convertBorder,
  createGrid,
  checkPointWithinBoundary,
  getNeighborIndices,
  mapBorder,
} = require("./utils");

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
        if (checkPointWithinBoundary(loc, cell)) {
          cell.totalCount += 1;
          if (!cell.totalLocations) cell.totalLocations = [];
          cell.totalLocations.push(loc);
          if (checkPointWithinBoundary(clickedPoint, cell)) {
            dayCounts[day]++;
          }
          break;
        }
      }
    }

    const matchingCell = grid.find((cell) =>
      checkPointWithinBoundary(clickedPoint, cell)
    );
    const neighbors = getNeighborIndices(matchingCell);
    const allCells = [
      matchingCell,
      ...neighbors.map(({ row, col }) => grid[row * COLS + col]),
    ];

    const overallTotalCount = locations.filter((loc) =>
      allCells.some((cell) => checkPointWithinBoundary(loc, cell))
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
