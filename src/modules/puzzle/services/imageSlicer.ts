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

/** Slices an image into N×N tile data URLs for the puzzle board. */
export async function sliceImage(
  _file: File,
  _gridSize: number,
): Promise<SliceResult> {
  throw new Error("Not implemented");
}
