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
  const rows = 10;
  const cols = 10;
  const checkLat = (border.maxLat - border.minLat) / rows;
  const checkLong = (border.maxLng - border.minLng) / cols;


  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
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

export function checkPoint(point, cell) {
  const { mapLat, mapLong } = point;
  const { minLat, maxLat, minLng, maxLng } = cell.bounds;
  
  const checkLat = mapLat >= minLat && mapLat < maxLat
  const checkLong = mapLong >= minLng && mapLong < maxLng

  return checkLat && checkLong;
}