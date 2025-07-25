export const ROWS = 20;
export const COLS = 20;

export const mapBorder = {
  polygon: [
    { lat: 37.48188439982738, lng: -122.15137870228908 },
    { lat: 37.480519446100864, lng: -122.15077332026456 },
    { lat: 37.47982552151212, lng: -122.16782010873156 },
    { lat: 37.48215891264268, lng: -122.16750300387568 },
  ],
};

export function convertBorder(polygon) {
  let lats = polygon.map((point) => point.lat);
  let longs = polygon.map((point) => point.lng);

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...longs),
    maxLng: Math.max(...longs),
  };
}

export function createGrid(border) {
  const cells = [];
  const checkLat = (border.maxLat - border.minLat) / ROWS;
  const checkLong = (border.maxLng - border.minLng) / COLS;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      cells.push({
        row: row,
        col: col,
        bounds: {
          minLat: border.minLat + row * checkLat,
          maxLat: border.minLat + (row + 1) * checkLat,
          minLng: border.minLng + col * checkLong,
          maxLng: border.minLng + (col + 1) * checkLong,
        },
        count: 0,
      });
    }
  }

  return cells;
}

export function checkPointWithinBoundary(point, cell) {
  const { mapLat, mapLong } = point;
  const { minLat, maxLat, minLng, maxLng } = cell.bounds;

  const checkLat = mapLat >= minLat && mapLat < maxLat;
  const checkLong = mapLong >= minLng && mapLong < maxLng;

  return checkLat && checkLong;
}

export function getNeighborIndices(cell) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  return directions
    .map(([row, col]) => ({
      row: cell.row + row,
      col: cell.col + col,
    }))
    .filter(({ row, col }) => row >= 0 && row < ROWS && col >= 0 && col < COLS);
}

export function createClusters(grid) {
  const visited = new Set();
  const clusters = [];
  const getIndex = (row, col) => row * COLS + col;

  for (const cell of grid) {
    const index = getIndex(cell.row, cell.col);
    if (visited.has(index) || cell.count === 0) continue;

    let queue = [cell];
    let clusterCells = [];
    let totalCount = 0;

    while (queue.length > 0) {
      const current = queue.pop();
      const currentIndex = getIndex(current.row, current.col);
      if (visited.has(currentIndex)) continue;

      visited.add(currentIndex);
      clusterCells.push(current);
      totalCount += current.count;

      const neighbors = getNeighborIndices(current);
      for (const { row, col } of neighbors) {
        const neighborIndex = getIndex(row, col);
        const neighbor = grid[neighborIndex];
        if (neighbor && neighbor.count > 0 && !visited.has(neighborIndex)) {
          queue.push(neighbor);
        }
      }
    }
    clusters.push({
      cells: clusterCells,
      totalCount,
    });
  }
  return clusters;
}

export function getCentroid(cluster) {
  let totalLong = 0;
  let totalLat = 0;

  for (const cell of cluster.cells) {
    const centerLat = (cell.bounds.minLat + cell.bounds.maxLat) / 2;
    const centerLong = (cell.bounds.minLng + cell.bounds.maxLng) / 2;

    totalLat += centerLat / cluster.cells.length;
    totalLong += centerLong / cluster.cells.length;
  }
  return { lat: totalLat, lng: totalLong };
}

export function getBiggestCluster(clusters) {
  let highestCluster = clusters[0];
  for (let i = 0; i < clusters.length; i++) {
    if (clusters[i].totalCount > highestCluster.totalCount) {
      highestCluster = clusters[i];
    }
  }
  return highestCluster;
}

function haverstineEquation(dataPoint1, dataPoint2) {
  const R = 6371;
  const degreeToRadian = (degree) => (degree * Math.PI) / 180;
  const lat = degreeToRadian(dataPoint2.lat - dataPoint1.lat);
  const lng = degreeToRadian(dataPoint2.lng - dataPoint1.lng);

  const a =
    Math.sin(lat / 2) * Math.sin(lat / 2) +
    Math.cos(degreeToRadian(dataPoint1.lat)) *
      Math.cos(degreeToRadian(dataPoint2.lat)) *
      Math.sin(lng / 2) *
      Math.sin(lng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function getBorderPoints(grid) {
  const borderCells = [];
  for (const cell of grid) {
    if (
      cell.row === 0 ||
      cell.col === 0 ||
      cell.row === ROWS - 1 ||
      cell.col === COLS - 1
    ) {
      borderCells.push(cell);
    }
  }
  return borderCells;
}

export function getLowestPopulation(grid, clusters) {
  const index = (row, col) => row * COLS + col;
  const skipSet = new Set();
  const borderPoints = getBorderPoints(grid);

  for (const cluster of clusters) {
    for (const cell of cluster.cells) {
      const cellIndex = index(cell.row, cell.col);
      skipSet.add(cellIndex);

      const neighbors = getNeighborIndices(cell);
      for (const { row, col } of neighbors) {
        const neighborIndex = index(row, col);
        skipSet.add(neighborIndex);
      }
    }
  }

  const centroids = clusters.map(getCentroid);
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestCell = null;

  for (const cell of grid) {
    const cellIndex = index(cell.row, cell.col);
    if (skipSet.has(cellIndex)) continue;

    const cellCenter = {
      lat: (cell.bounds.minLat + cell.bounds.maxLat) / 2,
      lng: (cell.bounds.minLng + cell.bounds.maxLng) / 2,
    };

    let minCentroidDistance = Number.MAX_VALUE;
    for (const centroid of centroids) {
      const distance = haverstineEquation(cellCenter, centroid);
      if (distance < minCentroidDistance) {
        minCentroidDistance = distance;
      }
    }

    let minBorderDistance = Number.MAX_VALUE;
    for (const borderCell of borderPoints) {
      const borderCenter = {
        lat: (borderCell.bounds.minLat + borderCell.bounds.maxLat) / 2,
        lng: (borderCell.bounds.minLng + borderCell.bounds.maxLng) / 2,
      };
      const distance = haverstineEquation(cellCenter, borderCenter);
      if (distance < minBorderDistance) {
        minBorderDistance = distance;
      }
    }

    const score = minCentroidDistance * minBorderDistance;
    if (score > bestScore) {
      bestScore = score;
      bestCell = cell;
    }
  }

  const cellLat = (bestCell.bounds.minLat + bestCell.bounds.maxLat) / 2;
  const cellLng = (bestCell.bounds.minLng + bestCell.bounds.maxLng) / 2;

  return {
    lat: cellLat,
    lng: cellLng,
  };
}

export function groupUsersByGrid(locations, grid) {
  const groupedUsers = [];

  for (const loc of locations) {
    for (const cell of grid) {
      if (checkPointWithinBoundary(loc, cell)) {
        const center = {
          lat: (cell.bounds.minLat + cell.bounds.maxLat) / 2,
          lng: (cell.bounds.minLng + cell.bounds.maxLng) / 2,
        };

        const existing = groupedUsers.find(
          (g) => g.lat === center.lat && g.lng === center.lng
        );

        if (existing) {
          existing.users.push(loc);
        } else {
          groupedUsers.push({ lat: center.lat, lng: center.lng, users: [loc] });
        }
        break;
      }
    }
  }
  return groupedUsers;
}
