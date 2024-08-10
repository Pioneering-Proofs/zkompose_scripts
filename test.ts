function generateRoundedRectangleMatrix(xWidth: number, yWidth: number, cornerRadius: number): number[][] {
  // Ensure dimensions and corner radius are valid
  if (xWidth <= 0 || yWidth <= 0 || cornerRadius < 0) {
    throw new Error("Invalid dimensions or corner radius");
  }

  // Limit corner radius to half of the smaller dimension
  const maxRadius = Math.min(xWidth, yWidth) / 2;
  cornerRadius = Math.min(cornerRadius, maxRadius);

  // Initialize matrix with zeros
  const matrix: number[][] = Array(yWidth).fill(0).map(() => Array(xWidth).fill(0));

  // Helper function to check if a point is inside the rounded corner
  const isInsideCorner = (x: number, y: number, centerX: number, centerY: number): boolean => {
    const dx = Math.abs(x - centerX);
    const dy = Math.abs(y - centerY);
    return Math.sqrt(dx * dx + dy * dy) <= cornerRadius;
  };

  // Fill the matrix
  for (let y = 0; y < yWidth; y++) {
    for (let x = 0; x < xWidth; x++) {
      // Check if point is inside the main rectangle
      if (x >= cornerRadius && x < xWidth - cornerRadius &&
        y >= cornerRadius && y < yWidth - cornerRadius) {
        matrix[y][x] = 1;
      }
      // Check corners
      else if (
        isInsideCorner(x, y, cornerRadius, cornerRadius) || // Top-left
        isInsideCorner(x, y, xWidth - cornerRadius - 1, cornerRadius) || // Top-right
        isInsideCorner(x, y, cornerRadius, yWidth - cornerRadius - 1) || // Bottom-left
        isInsideCorner(x, y, xWidth - cornerRadius - 1, yWidth - cornerRadius - 1) // Bottom-right
      ) {
        matrix[y][x] = 1;
      }
    }
  }

  return matrix;
}

// Example usage
const xWidth = 24;
const yWidth = 24;
const cornerRadius = 2;

const roundedRectangleMatrix = generateRoundedRectangleMatrix(xWidth, yWidth, cornerRadius);

// Print the matrix
roundedRectangleMatrix.forEach(row => console.log(row.join(' ')));