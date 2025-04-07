import { useCallback } from 'react';
// import { ReactSketchCanvasRef } from 'react-sketch-canvas'; // REMOVED
import Konva from 'konva'; // IMPORT Konva
// import Paper from '@/assets/placeholders/paper.png'; // REMOVED - Assume background is handled by Konva Stage/Layers
import { toast } from '@/components/ui/use-toast';
import { COLLECTION_ADDRESS } from '@/constants';
import { useAbiClient } from '@/contexts/AbiProvider';

export const useSketchExport = () => {
  const { abi, ledgeABI } = useAbiClient();

  const exportMergedSketch = useCallback(
    async (
      // canvasRef: React.RefObject<ReactSketchCanvasRef>, // REMOVED
      stageRef: React.RefObject<Konva.Stage>, // CHANGED to Stage Ref
      canvasSize: number, // Keep for potential metadata or validation?
      elapsedTime: number,
      drawingStartTime: number,
      traceImage: string | null, // Keep for usedTracing flag
      getSecurityToken: () => string
    ) => {
      try {
        // if (!canvasRef.current) { // REMOVED
        if (!stageRef.current) { // CHECK Stage Ref
          throw new Error('Konva Stage reference is not available');
        }

        console.log("Exporting Konva stage...");

        // 1. Export the entire stage as Data URL
        // Konva handles merging visible layers automatically
        const drawingDataUrl = stageRef.current.toDataURL({
          mimeType: "image/png",
          // Optional: Adjust quality or resolution if needed
          // quality: 0.8,
          // pixelRatio: 2, // For higher resolution export
        });

        if (!drawingDataUrl) {
           throw new Error("Failed to export stage to data URL");
        }

        // --- Merging Logic Removed (Konva handles it) ---

        // 2. Convert Data URL to Blob
        const fetchRes = await fetch(drawingDataUrl);
        const blob = await fetchRes.blob();

        if (!blob) {
          throw new Error("Failed to create blob from exported stage data");
        }

        // 3. Calculate server-verifiable metrics (Keep existing logic)
        const actualElapsedSeconds = Math.floor((Date.now() - drawingStartTime) / 1000);
        const reportedElapsedSeconds = elapsedTime;

        // Detect potential timer manipulation (Keep existing logic)
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

        // 4. Get NFT ID (Keep existing logic)
        const idResult = await abi?.useABI(ledgeABI).view.get_nft_minted({
          typeArguments: [],
          functionArguments: [COLLECTION_ADDRESS],
        });
        const id = parseInt(idResult?.[0] || "0") + 1;

        // 5. Create the File object from the blob
        const file = new File([blob], `${id}.png`, { type: "image/png" });

        // 6. Return the submission data
        return {
          file,
          // drawPath: mergedDataUrl, // REMOVED
          drawPath: "", // Or null, consistent with PencilSketchPortal change
          id: id.toString(),
          usedTracing: !!traceImage, // Base this on the presence of the initial traceImage prop
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