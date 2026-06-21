export interface SlicedTile {
  index: number;
  dataUrl: string;
}

export interface SliceResult {
  size: number;
  tiles: SlicedTile[];
  sourceWidth: number;
  sourceHeight: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    image.src = url;
  });
}

/*
 * Loads an image file, center-crops it to a square, and slices it into a grid.
 * Each slice index matches the solved-board cell (0 = top-left, blank cell included).
 * @param file - The uploaded image (.jpg, .png, etc.).
 * @param gridSize - Puzzle dimension (3 for a 3×3 grid).
 * @returns Slice metadata and data URLs for every grid cell.
 */
export async function sliceImage(file: File, gridSize: number): Promise<SliceResult> {
  const image = await loadImage(file);

  const side = Math.min(image.width, image.height);
  const sx = (image.width - side) / 2;
  const sy = (image.height - side) / 2;
  const tileSize = side / gridSize;
  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const tiles: SlicedTile[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const index = row * gridSize + col;
      const canvas = document.createElement("canvas");
      canvas.width = tileSize;
      canvas.height = tileSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas is not available");
      }

      ctx.drawImage(
        image,
        sx + col * tileSize,
        sy + row * tileSize,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize,
      );

      tiles.push({
        index,
        dataUrl: canvas.toDataURL(outputType, 0.92),
      });
    }
  }

  return {
    size: gridSize,
    tiles,
    sourceWidth: image.width,
    sourceHeight: image.height,
  };
}
