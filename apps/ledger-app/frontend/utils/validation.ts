/**
 * Counts the number of non-empty (drawn) pixels on a canvas
 * @param canvas - The HTML canvas element to analyze
 * @returns The number of pixels with non-transparent content
 */
export function countDrawnPixels(canvas: HTMLCanvasElement): number {
  // Get the canvas context and image data
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let drawnPixels = 0;
  
  // Check each pixel (RGBA values are stored as 4 consecutive array elements)
  // Only count pixels with some opacity (alpha > 0)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) {
      drawnPixels++;
    }
  }
  
  return drawnPixels;
}

// Minimum required pixels for a 1000x1000 canvas (1% of total pixels)
export const MIN_DRAWN_PIXELS = 10000; 