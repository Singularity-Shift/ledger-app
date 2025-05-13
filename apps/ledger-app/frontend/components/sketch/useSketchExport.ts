import { useCallback } from 'react';
import Paper from '@/assets/placeholders/paper.png';
import { toast } from '@/components/ui/use-toast';
import { COLLECTION_ADDRESS } from '@/constants';
import { useAbiClient } from '@/contexts/AbiProvider';

export const useSketchExport = () => {
  const { abi, ledgeABI } = useAbiClient();

  const exportMergedSketch = useCallback(
    async (
      canvasRef: React.RefObject<{ exportImage: (mimeType: string) => string }>,
      canvasSize: number,
      elapsedTime: number,
      drawingStartTime: number,
      traceImage: string | null,
      getSecurityToken: () => string
    ) => {
      try {
        if (!canvasRef.current || !canvasRef.current.exportImage) {
          throw new Error('Canvas reference is not available');
        }

        console.log("Exporting drawing...");

        // 1. Export the drawing layer (transparent background)
        const drawingDataUrl = canvasRef.current.exportImage("png");

        // --- Merging Logic Start ---

        // 2. Create a temporary canvas
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get 2D context for merging");
        }

        // 3. Set temporary canvas dimensions
        tempCanvas.width = canvasSize;
        tempCanvas.height = canvasSize;

        // 4. Load both paper background and drawing images
        const paperImg = new Image();
        const drawingImg = new Image();

        const loadImage = (img: HTMLImageElement, src: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = src;
          });
        };

        await Promise.all([
          loadImage(paperImg, Paper), // Use the imported Paper variable
          loadImage(drawingImg, drawingDataUrl),
        ]);

        // 5. Draw background image first
        ctx.drawImage(paperImg, 0, 0, tempCanvas.width, tempCanvas.height);

        // 6. Draw the user's sketch on top
        ctx.drawImage(drawingImg, 0, 0, tempCanvas.width, tempCanvas.height);

        // 7. Export the merged canvas as a Blob
        const blob = await new Promise<Blob | null>((resolve) => {
          tempCanvas.toBlob(resolve, "image/png");
        });

        if (!blob) {
          throw new Error("Failed to create blob from merged canvas");
        }

        // Calculate server-verifiable metrics
        const actualElapsedSeconds = Math.floor((Date.now() - drawingStartTime) / 1000);
        const reportedElapsedSeconds = elapsedTime;

        // Detect potential timer manipulation - use a more forgiving validation
        // Only validate if the actual time is less than half the reported time
        if (actualElapsedSeconds < reportedElapsedSeconds * 0.2) {
          console.warn("Potential timer manipulation detected!");
          console.log(`Actual seconds: ${actualElapsedSeconds}, Reported seconds: ${reportedElapsedSeconds}`);
          toast({
            variant: "destructive",
            title: "Submission Error",
            description: "Drawing time validation failed. Please try again.",
          });
          return null;
        }

        // Get NFT ID
        const idResult = await abi?.useABI(ledgeABI).view.get_nft_minted({
          typeArguments: [],
          functionArguments: [COLLECTION_ADDRESS],
        });
        const id = parseInt(idResult?.[0] || "0") + 1;

        // Create the File object from the merged blob
        const file = new File([blob], `${id}.png`, { type: "image/png" });

        // Get the Data URL for the merged image
        const mergedDataUrl = tempCanvas.toDataURL("image/png");

        // Return the submission data
        return {
          file,
          drawPath: mergedDataUrl,
          id: id.toString(),
          usedTracing: !!traceImage,
          securityToken: getSecurityToken(),
          success: true,
        };
      } catch (error) {
        console.error("Error exporting drawing:", error);
        toast({
          variant: "destructive",
          title: "Export Error",
          description: `Failed to export your drawing: ${error instanceof Error ? error.message : String(error)}`,
        });
        return null;
      }
    },
    [abi, ledgeABI]
  );

  return { exportMergedSketch };
};

export default useSketchExport; 