// Rectangular board layout utilities
// Formula: Total = 2 * (Width + Height) - 4
// The tiles form a hollow rectangle perimeter

export interface BoardDimensions {
  width: number;
  height: number;
  total: number;
}

// Valid board sizes that form hollow rectangles
// min side = 3 (so inner space exists), max reasonable = 12
export const VALID_BOARD_SIZES: BoardDimensions[] = [];

// Generate valid sizes: width >= height, both >= 3
for (let w = 3; w <= 12; w++) {
  for (let h = 3; h <= w; h++) {
    const total = 2 * (w + h) - 4;
    VALID_BOARD_SIZES.push({ width: w, height: h, total });
  }
}

// Sort by total
VALID_BOARD_SIZES.sort((a, b) => a.total - b.total);

// Remove duplicates by total (keep the most square option)
export const UNIQUE_BOARD_SIZES: BoardDimensions[] = [];
const seenTotals = new Set<number>();
for (const s of VALID_BOARD_SIZES) {
  if (!seenTotals.has(s.total)) {
    seenTotals.add(s.total);
    UNIQUE_BOARD_SIZES.push(s);
  }
}

export function getDimensionsForTotal(total: number): BoardDimensions {
  // Find the closest valid dimensions
  const found = VALID_BOARD_SIZES.find((s) => s.total === total);
  if (found) return found;
  // Fallback: find closest
  let best = VALID_BOARD_SIZES[0];
  let bestDiff = Math.abs(best.total - total);
  for (const s of VALID_BOARD_SIZES) {
    const diff = Math.abs(s.total - total);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = s;
    }
  }
  return best;
}

export interface TilePosition {
  tileIndex: number;
  row: number;
  col: number;
  side: 'top' | 'right' | 'bottom' | 'left' | 'corner';
}

/**
 * Maps tile indices to their (row, col) positions on the hollow rectangle.
 * Traversal order: top row L→R, right col T→B, bottom row R→L, left col B→T
 */
export function getTilePositions(width: number, height: number): TilePosition[] {
  const positions: TilePosition[] = [];
  let idx = 0;

  // Top row: left to right
  for (let c = 0; c < width; c++) {
    const isCorner = c === 0 || c === width - 1;
    positions.push({ tileIndex: idx++, row: 0, col: c, side: isCorner ? 'corner' : 'top' });
  }

  // Right column: top+1 to bottom-1
  for (let r = 1; r < height - 1; r++) {
    positions.push({ tileIndex: idx++, row: r, col: width - 1, side: 'right' });
  }

  // Bottom row: right to left
  for (let c = width - 1; c >= 0; c--) {
    const isCorner = c === 0 || c === width - 1;
    positions.push({ tileIndex: idx++, row: height - 1, col: c, side: isCorner ? 'corner' : 'bottom' });
  }

  // Left column: bottom-1 to top+1
  for (let r = height - 2; r >= 1; r--) {
    positions.push({ tileIndex: idx++, row: r, col: 0, side: 'left' });
  }

  return positions;
}

/**
 * Creates a 2D grid (height x width) where each cell is either a tile index or null (inner space).
 */
export function createBoardGrid(width: number, height: number): (number | null)[][] {
  const positions = getTilePositions(width, height);
  const grid: (number | null)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => null)
  );

  for (const pos of positions) {
    grid[pos.row][pos.col] = pos.tileIndex;
  }

  return grid;
}
