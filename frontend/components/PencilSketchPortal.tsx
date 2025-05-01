import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { toast } from "@/components/ui/use-toast";
import { useDrawingState } from "@/hooks/useDrawingState";
import { UploadSpinner } from '@/components/UploadSpinner';

// Import types and sub-components
import { PencilSketchPortalProps, PencilGrade } from "./sketch/sketchTypes";
import { findGradeByLabel, PENCIL_GRADES, COLORS } from "./sketch/sketchConstants";
import SketchCanvas, { SketchCanvasHandle } from "./sketch/SketchCanvas";
import DrawingModeControls from "./sketch/DrawingModeControls";
import TracingControls from "./sketch/TracingControls";
import ColorSelector from "./sketch/ColorSelector";
import PencilGradeSelector from "./sketch/PencilGradeSelector";
import StrokeWidthControl from "./sketch/StrokeWidthControl";
import ActionButtons from "./sketch/ActionButtons";
import DrawingTimer from "./sketch/DrawingTimer";

// Import custom hooks
import useSketchTimer from "./sketch/useSketchTimer";
import useSketchExport from "./sketch/useSketchExport";
import { moderateImage } from "@/utils/imageModeration";
import { fetchAutoDraw } from '@/utils/autoDraw';
import Paper from '@/assets/placeholders/paper.png';

// Add a helper delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Wrap the SketchCanvas component with memo to reduce re-renders
const MemoizedSketchCanvas = memo(SketchCanvas);

// Add a similar memo wrapper for the AI Image component with better error handling
const AIImageLayer = memo(({ image, canvasSize, onLoad, onError }: { 
  image: string | null, 
  canvasSize: number,
  onLoad?: () => void,
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state when image changes
    setImgLoaded(false);
    setImgError(false);
  }, [image]);

  if (!image) return null;
  
  const handleImageLoad = () => {
    console.log('[AI Image] Successfully loaded image');
    setImgLoaded(true);
    setImgError(false);
    if (onLoad) onLoad();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('[AI Image] Failed to load image:', e);
    setImgLoaded(false);
    setImgError(true);
    if (onError) onError(e);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${canvasSize}px`,
        height: `${canvasSize}px`,
        zIndex: 2,
        pointerEvents: "none",
        backgroundColor: "#ffffff",
        border: imgError ? "2px solid red" : "none",
      }}
    >
      <img
        ref={imgRef}
        key={typeof image === 'string' ? image.substring(0, 20) : 'ai-image'} 
        src={image}
        alt="AI Generated"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          visibility: imgLoaded ? 'visible' : 'hidden',
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous" // Add this to help with CORS issues
      />
      {!imgLoaded && !imgError && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: '#333',
          fontSize: '14px'
        }}>
          Loading AI image...
        </div>
      )}
      {imgError && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: 'red',
          fontSize: '14px',
          textAlign: 'center',
          padding: '10px'
        }}>
          Failed to load AI image
        </div>
      )}
    </div>
  );
});

export const PencilSketchPortal: React.FC<PencilSketchPortalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { drawingState, saveDrawingState, clearDrawingState, isDrawingStateLoaded } = useDrawingState();
  const sketchCanvasRef = useRef<SketchCanvasHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for canvas and drawing
  const [strokeWidth, setStrokeWidth] = useState(drawingState?.pencilConfig?.width ?? 2);
  const [selectedGrade, setSelectedGrade] = useState<PencilGrade>(
    (drawingState?.pencilConfig?.gradeLabel ? findGradeByLabel(drawingState.pencilConfig.gradeLabel) : undefined) ??
      PENCIL_GRADES[10], // Default HB (index 10)
  );
  const [baseColor, setBaseColor] = useState(drawingState?.pencilConfig?.color ?? COLORS[0].value);
  const [customColor, setCustomColor] = useState(drawingState?.pencilConfig?.color ?? COLORS[0].value);
  const [isEraser, setIsEraser] = useState(drawingState?.pencilConfig?.isEraser ?? false);
  const [isErasing, setIsErasing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState(1000);
  const [isRestored, setIsRestored] = useState(false);

  // Tracing feature state
  const [traceImage, setTraceImage] = useState(drawingState?.traceImage ?? null);
  const [tracingActive, setTracingActive] = useState(drawingState?.traceConfig?.active ?? false);
  const [imagePosition, setImagePosition] = useState(drawingState?.traceConfig?.position ?? { x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(drawingState?.traceConfig?.scale ?? 1);
  const [isAdjustMode, setIsAdjustMode] = useState(false);

  // Add new state for AI generated image
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);

  // Add state for dropper mode
  const [isDropperMode, setIsDropperMode] = useState(false);

  // Initialize timer hook
  const { elapsedTime, setElapsedTime, drawingStartTime, getSecurityToken } = useSketchTimer(
    isOpen,
    isRestored,
    drawingState?.elapsedTime ?? 0
  );

  // Initialize export hook
  const { exportMergedSketch } = useSketchExport();

  // Add new states for auto functionality
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Add state for AI image loading
  const [isAiImageLoading, setIsAiImageLoading] = useState(false);
  const [aiImageError, setAiImageError] = useState<string | null>(null);
  
  // Use a ref to track unmounting and prevent saving during it
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Calculate the actual stroke color based on the base color and opacity
  const strokeColor = useMemo(() => {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      // Remove # if present
      hex = hex.replace(/^#/, "");

      // Parse hex
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      return { r, g, b };
    };

    const rgb = hexToRgb(baseColor);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${selectedGrade.opacity})`;
  }, [baseColor, selectedGrade.opacity]);

  // Calculate the scaled stroke width based on canvas size
  const scaledStrokeWidth = useMemo(() => {
    const baseSize = 1000; // Original canvas size
    const scaleFactor = canvasSize / baseSize;
    return strokeWidth * scaleFactor;
  }, [strokeWidth, canvasSize]);

  // Adjust canvas size based on available height and width
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Get the container dimensions
          const containerHeight = entry.contentRect.height;
          const containerWidth = entry.contentRect.width;

          // Get actual window dimensions
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          // Calculate available space for canvas (accounting for controls)
          // Use smaller control height value for smaller screens
          const controlsHeight = windowWidth <= 960 ? 270 : 350;
          const availableHeight = Math.max(containerHeight - controlsHeight, 300);
          const availableWidth = Math.max(containerWidth - 40, 300); // 40px for padding

          // Base reduction factor - adjusted for different viewport sizes
          let reductionFactor = 0.92; // Default for larger screens
          
          // Add specific breakpoint for sub-960px widths
          if (windowWidth <= 960) {
            reductionFactor = 0.85; // More aggressive reduction for widths below 960px
          }

          // Apply additional size reduction for very small devices
          if (windowWidth <= 768) {
            reductionFactor = 0.8; // For tablets and smaller devices
          }

          // Further reduce size for smaller devices
          if (windowHeight <= 800 || windowWidth <= 400) {
            reductionFactor = 0.7;
            
            // Even smaller for very small devices
            if (windowWidth <= 360) {
              reductionFactor = 0.6;
            }
          }

          // Use the smaller of width or height to maintain square aspect ratio
          // Allow larger canvas on desktop (up to 1200px)
          const maxCanvasSize = windowWidth <= 960 ? 800 : 1200; // Smaller max for sub-960px
          const size = Math.min(availableWidth, availableHeight, maxCanvasSize) * reductionFactor;
          setCanvasSize(size);

          console.log(`Canvas sizing: width=${windowWidth}px, factor=${reductionFactor}, size=${size}px`); // Debug info
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isOpen]);

  // Restore state when the portal opens and state is loaded
  useEffect(() => {
    // Only attempt restoration if the portal is open, state is loaded, drawingState exists,
    // we haven't already restored in this session, and the canvas ref is available.
    if (isOpen && isDrawingStateLoaded && drawingState && !isRestored && sketchCanvasRef.current?.canvasRef.current) {
      console.log("Attempting to restore drawing state...");
      // Load drawing paths if they exist
      if (drawingState.drawingPaths) {
        try {
          sketchCanvasRef.current.canvasRef.current.loadPaths(drawingState.drawingPaths);
          console.log("Paths loaded successfully.");
        } catch (error) {
          console.error("Error loading drawing paths:", error);
          toast({
            variant: "destructive",
            title: "Restore Error",
            description: "Failed to load previous drawing paths.",
          });
        }
      }
      // Restore other states (tool settings, trace image, timer)
      setStrokeWidth(drawingState.pencilConfig?.width ?? 2);
      const restoredGrade = drawingState.pencilConfig?.gradeLabel
        ? findGradeByLabel(drawingState.pencilConfig.gradeLabel)
        : undefined;
      setSelectedGrade(restoredGrade ?? PENCIL_GRADES[10]);
      setBaseColor(drawingState.pencilConfig?.color ?? COLORS[0].value);
      setCustomColor(drawingState.pencilConfig?.color ?? COLORS[0].value); // Set custom color picker too
      setIsEraser(drawingState.pencilConfig?.isEraser ?? false);
      setElapsedTime(drawingState.elapsedTime ?? 0);
      setTraceImage(drawingState.traceImage ?? null);
      setTracingActive(drawingState.traceConfig?.active ?? false);
      setImagePosition(drawingState.traceConfig?.position ?? { x: 0, y: 0 });
      setImageScale(drawingState.traceConfig?.scale ?? 1);
      
      // Restore AI-generated image if it exists
      if (drawingState.aiGeneratedImage) {
        setAiGeneratedImage(drawingState.aiGeneratedImage);
        console.log("AI-generated image restored.");
      }

      // Mark that state has been restored
      setIsRestored(true);
      console.log("Drawing state restored.");
      toast({ title: "Drawing Restored", description: "Your previous drawing progress has been loaded." });
    } else if (isOpen && isDrawingStateLoaded && !drawingState && !isRestored) {
      // Condition for: Portal is open, state is loaded, NO saved state exists, and we haven't initialized yet.
      console.log("No saved state found, clearing canvas.");
      sketchCanvasRef.current?.canvasRef.current?.clearCanvas();
      setElapsedTime(0); // Reset timer if no state
      // Mark as 'restored' because we've handled the initial state (empty canvas).
      setIsRestored(true);
    } else if (!isOpen) {
      // Reset isRestored flag when portal closes, allowing restoration on next open
      if (isRestored) {
        setIsRestored(false);
        console.log("Portal closed, reset isRestored flag.");
      }
    }
  }, [isOpen, isDrawingStateLoaded, isRestored, drawingState, clearDrawingState, toast, setElapsedTime]);

  // Update save current state to check for mounted status
  const saveCurrentState = useCallback(async () => {
    // Only save if component is still mounted and the initial restoration is complete
    if (!isMounted.current || !isRestored || !sketchCanvasRef.current?.canvasRef.current) {
      return;
    }

    console.log("Saving current state...");
    try {
      const paths = await sketchCanvasRef.current.canvasRef.current.exportPaths();

      saveDrawingState({
        drawingPaths: paths,
        elapsedTime: elapsedTime,
        lastActiveTimestamp: Date.now(),
        traceImage: traceImage,
        traceConfig: {
          active: tracingActive,
          position: imagePosition,
          scale: imageScale,
        },
        pencilConfig: {
          color: baseColor,
          width: strokeWidth,
          gradeLabel: selectedGrade.label,
          isEraser: isEraser,
        },
        aiGeneratedImage: aiGeneratedImage,
      });
      console.log("State saved.");
    } catch (error) {
      console.error("Error exporting/saving drawing state:", error);
      toast({ variant: "destructive", title: "Save Error", description: "Could not save drawing progress." });
    }
  }, [
    isRestored,
    elapsedTime,
    traceImage,
    tracingActive,
    imagePosition,
    imageScale,
    baseColor,
    strokeWidth,
    selectedGrade,
    isEraser,
    aiGeneratedImage,
    saveDrawingState,
    toast,
  ]);

  // Save state on drawing/erasing actions
  const handlePointerUp = useCallback(() => {
    setIsErasing(false);
    saveCurrentState(); // Save after drawing action completes
    setHasDrawn(true);
  }, [saveCurrentState]);

  // Save state before the window unloads
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Check if there's something potentially worth saving
      if (isOpen && isRestored && sketchCanvasRef.current?.canvasRef.current && elapsedTime > 0) {
        console.log("beforeunload: Triggering saveCurrentState...");
        saveCurrentState();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Save when component unmounts only if it was open and restored.
      if (isOpen && isRestored) {
        console.log("Unmount: Triggering saveCurrentState...");
        saveCurrentState();
      }
    };
  }, [isOpen, isRestored, elapsedTime, saveCurrentState]);

  // Clear state handlers
  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your drawing? This cannot be undone.")) {
      console.log("Clearing canvas and state...");
      sketchCanvasRef.current?.canvasRef.current?.clearCanvas();
      setTraceImage(null);
      setTracingActive(false);
      setImagePosition({ x: 0, y: 0 });
      setImageScale(1);
      setElapsedTime(0);
      setAiGeneratedImage(null); // Clear AI-generated image
      clearDrawingState();
      setIsRestored(true); // Set to true because the 'restored' state is now empty canvas
      console.log("State cleared.");
      toast({ title: "Canvas Cleared", description: "Your drawing has been cleared." });
    }
  }, [clearDrawingState, setElapsedTime, toast]);

  const handleUndo = () => {
    sketchCanvasRef.current?.canvasRef.current?.undo();
  };

  const handleRedo = () => {
    sketchCanvasRef.current?.canvasRef.current?.redo();
  };

  // Handle submission
  const handleSubmit = useCallback(async () => {
    let moderationPassed = false; // Flag to track moderation status
    try {
      if (sketchCanvasRef.current?.canvasRef.current && onSubmit) {
        console.log("Submitting drawing...");

        // Use the export hook to handle the export and merge
        const exportResult = await exportMergedSketch(
          sketchCanvasRef.current.canvasRef,
          canvasSize,
          elapsedTime,
          drawingStartTime,
          traceImage,
          getSecurityToken
        );

        if (!exportResult || !exportResult.file) {
          console.error("Export failed or file missing");
          toast({ variant: "destructive", title: "Export Error", description: "Could not generate the image file." });
          return;
        }

        console.log("Image exported, proceeding to moderation...");

        // --- Moderation Step --- START
        const fileToDataUrl = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };

        let isFlagged = true; // Default to flagged to be safe
        try {
          const imageDataUrl = await fileToDataUrl(exportResult.file);
          isFlagged = await moderateImage(imageDataUrl);
        } catch (moderationError) {
          console.error("Error during image moderation:", moderationError);
          toast({
            variant: "destructive",
            title: "Moderation Error",
            description: `Could not check image content. Please try again. ${moderationError instanceof Error ? moderationError.message : ''}`,
          });
          return; // Stop submission if moderation API fails
        }

        if (isFlagged) {
          console.warn("Image failed moderation check.");
          toast({
            variant: "destructive",
            title: "Moderation Failed",
            description: "The generated image was flagged as potentially harmful and cannot be submitted.",
          });
          return; // Stop submission if flagged
        }
        // --- Moderation Step --- END

        console.log("Moderation passed. Submitting...");
        moderationPassed = true; // Mark as passed

        // Call onSubmit with the exported data
        onSubmit(
          exportResult.file,
          elapsedTime,
          exportResult.drawPath,
          exportResult.id,
          exportResult.usedTracing,
          exportResult.securityToken
        );

        toast({ title: "Success", description: "Your drawing has been submitted!" });
        setIsRestored(false); // Reset restored flag so next open checks storage again
        console.log("Drawing submitted, state NOT cleared yet.");
        onClose(); // Close the portal
      }
    } catch (error) {
      console.error("Error submitting drawing:", error);
      // Only show generic submission error if moderation hasn't already failed
      if (!moderationPassed) { 
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: `Failed to submit your drawing: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }
  }, [onSubmit, elapsedTime, traceImage, onClose, getSecurityToken, exportMergedSketch, canvasSize, toast, drawingStartTime]);

  // Tracing image handlers
  const handleTraceButtonClick = () => {
    sketchCanvasRef.current?.fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageResult = event.target.result as string;
          setTraceImage(imageResult);
          setTracingActive(true);
          // Center the image initially
          const position = { x: 0, y: 0 };
          const scale = 1;
          setImagePosition(position);
          setImageScale(scale);
          // Save state after setting trace image
          saveDrawingState({
            traceImage: imageResult,
            traceConfig: { active: true, position, scale },
          });
          toast({ title: "Image Selected", description: "You can now trace over this image." });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Tracing Config Handlers
  const handleToggleTracing = () => {
    const newActiveState = !tracingActive;
    setTracingActive(newActiveState);
    // Construct a complete traceConfig object using current state
    saveDrawingState({
      traceConfig: {
        active: newActiveState,
        position: imagePosition,
        scale: imageScale,
      },
    });
  };

  const handleScaleIncrease = () => {
    const newScale = Math.min(imageScale + 0.1, 2);
    setImageScale(newScale);
    // Construct a complete traceConfig object using current state
    saveDrawingState({
      traceConfig: {
        active: tracingActive,
        position: imagePosition,
        scale: newScale,
      },
    });
  };

  const handleScaleDecrease = () => {
    const newScale = Math.max(imageScale - 0.1, 0.5);
    setImageScale(newScale);
    // Construct a complete traceConfig object using current state
    saveDrawingState({
      traceConfig: {
        active: tracingActive,
        position: imagePosition,
        scale: newScale,
      },
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // When in draw mode with eraser active
    if (!isAdjustMode && isEraser) {
      setIsErasing(true);
      const rect = sketchCanvasRef.current?.canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // When in draw mode with eraser active
    if (!isAdjustMode && isEraser && isErasing) {
      const rect = sketchCanvasRef.current?.canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  // Improved dropper handler: await image load and correct coordinate mapping
  const handleDropperPick = useCallback(async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDropperMode || !sketchCanvasRef.current?.canvasRef.current || !sketchCanvasRef.current.canvasContainerRef.current) return;
    // Compute click position relative to displayed canvas
    const rect = sketchCanvasRef.current.canvasContainerRef.current.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    try {
      // Export drawing layer as PNG data URL
      const dataUrl = await sketchCanvasRef.current.canvasRef.current.exportImage("png");
      const img = new window.Image();
      // Wait for image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image for dropper"));
        img.src = dataUrl;
      });
      // Draw onto a temp canvas matching display size
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvasSize;
      tempCanvas.height = canvasSize;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
      // Sample pixel color
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      setBaseColor(hex);
      setCustomColor(hex);
      toast({ title: "Color Picked", description: hex });
    } catch (err) {
      console.error("Dropper error:", err);
      toast({ variant: "destructive", title: "Dropper Error", description: "Could not pick color." });
    } finally {
      setIsDropperMode(false);
    }
  }, [isDropperMode, canvasSize, toast, setBaseColor, setCustomColor, setIsDropperMode]);

  // Completely revamp the handleAuto function
  const handleAuto = useCallback(async () => {
    console.log('[Auto] Button clicked. Current state:', { hasDrawn, isSending });

    if (!hasDrawn || isSending) {
      console.log('[Auto] Aborting: Already sending or nothing drawn.');
      return;
    }

    // Use a single canvas ref for clarity
    const canvas = sketchCanvasRef.current?.canvasRef.current;
    if (!canvas) {
      console.error('[Auto] Canvas ref not available');
      return;
    }

    const fd = new FormData();
    try {
      console.log('[Auto] Preparing FormData...');
      const paperBlob = await fetch(Paper).then(r => r.blob());
      console.log(`[Auto] Paper blob size: ${paperBlob.size}`);
      fd.append('paper', paperBlob, 'paper.png');

      // Ensure we properly await the exportImage result
      const dataUrl = await canvas.exportImage('png');
      const sketchBlob = await fetch(dataUrl).then(r => r.blob());
      console.log(`[Auto] Sketch blob size: ${sketchBlob.size}`);
      fd.append('sketch', sketchBlob, 'sketch.png');

      console.log('[Auto] FormData prepared.');

      await delay(100); // Small delay BEFORE setting isSending true
      console.log('[Auto] Setting isSending to true...');
      setIsSending(true); // Spinner should appear now
      setIsAiImageLoading(true);
      setAiImageError(null);

      console.log('[Auto] Calling fetch...');
      console.log('[Auto] Backend URL from env:', import.meta.env.VITE_AUTO_BACKEND_URL);
      
      // Get the response
      const response = await fetch(import.meta.env.VITE_AUTO_BACKEND_URL || '/api/auto', { 
        method: 'POST', 
        body: fd 
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
      }
      
      console.log(`[Auto] Response status: ${response.status} ${response.statusText}`);

      // Get the image as a blob
      const imageBlob = await response.blob();
      console.log(`[Auto] Image blob received: ${imageBlob.type}, size: ${imageBlob.size}`);
      
      if (imageBlob.size === 0) {
        throw new Error('Received empty image from server');
      }

      // Create a temporary image object to load the AI result
      const img = new Image();
      img.onload = async () => {
        // Only proceed if component is still mounted
        if (!isMounted.current) {
          console.log('[Auto] Component unmounted, aborting image render');
          URL.revokeObjectURL(img.src);
          return;
        }

        console.log('[Auto] AI image loaded, size:', img.width, 'x', img.height);
        
        // First, clear the canvas completely
        canvas.clearCanvas();

        // We'll draw the AI image directly onto the canvas
        // This is done by creating a canvas element and passing it to loadPaths
        try {
          // Use the react-sketch-canvas importPath method to draw the AI image
          // First, create a data URL representation of the image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          const ctx = tempCanvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');
          
          // Draw the original paper background
          const paperImg = new Image();
          paperImg.src = Paper;
          
          // Wait for paper to load
          if (!paperImg.complete) {
            await new Promise(resolve => {
              paperImg.onload = resolve;
            });
          }
          
          ctx.drawImage(paperImg, 0, 0, tempCanvas.width, tempCanvas.height);
          ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          
          // Now we have the combined image on the temp canvas
          // Let's import it as a single SVG path into the canvas
          const imageDataUrl = tempCanvas.toDataURL('image/png');
          
          // Create a simple div we can use to position the image
          const imgContainer = document.createElement('div');
          imgContainer.style.width = `${canvasSize}px`;
          imgContainer.style.height = `${canvasSize}px`;
          imgContainer.style.position = 'relative';
          
          const imgElement = document.createElement('img');
          imgElement.src = imageDataUrl;
          imgElement.style.width = '100%';
          imgElement.style.height = '100%';
          imgElement.style.position = 'absolute';
          imgElement.style.top = '0';
          imgElement.style.left = '0';
          
          imgContainer.appendChild(imgElement);
          document.body.appendChild(imgContainer);

          // Now we can draw this to our sketch canvas
          // We'll use a timeout to ensure the DOM has updated
          setTimeout(() => {
            // Remove the temporary elements
            document.body.removeChild(imgContainer);

            // Set the AI image in the state
            setAiGeneratedImage(imageDataUrl);
            
            // Now notify UI that we've finished
            setIsAiImageLoading(false);
            setIsSending(false);
            console.log('[Auto] AI image processing complete');

            // Save the state
            saveDrawingState({
              aiGeneratedImage: imageDataUrl,
              drawingPaths: [], // Explicitly set empty drawing paths
            });
          }, 100);

        } catch (renderError: unknown) {
          const errorMessage = renderError instanceof Error 
            ? renderError.message 
            : 'Unknown error rendering image';
          
          console.error('[Auto] Error rendering AI image:', renderError);
          setAiImageError(`Error rendering: ${errorMessage}`);
          setIsAiImageLoading(false);
          setIsSending(false);
        }
      };

      img.onerror = (e) => {
        console.error('[Auto] Failed to load AI image:', e);
        setAiImageError('Failed to load AI image');
        setIsAiImageLoading(false);
        setIsSending(false);
      };

      // Create a blob URL for the image - we'll clean this up immediately after loading
      img.src = URL.createObjectURL(imageBlob);

    } catch (error) {
      console.error('[Auto] Error during fetch or state update:', error);
      setAiImageError(error instanceof Error ? error.message : String(error));
      setIsAiImageLoading(false);
      setIsSending(false);
      
      toast({
        variant: "destructive",
        title: "Auto-Draw Error",
        description: `Failed to process image: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }, [hasDrawn, isSending, saveDrawingState, toast, canvasSize]);

  // Memoize the canvas rendering
  const renderedCanvas = useMemo(() => (
    <MemoizedSketchCanvas
      ref={sketchCanvasRef}
      canvasSize={canvasSize}
      strokeColor={strokeColor}
      isEraser={isEraser}
      isErasing={isErasing}
      isAdjustMode={isAdjustMode}
      tracingActive={tracingActive}
      traceImage={traceImage}
      imagePosition={imagePosition}
      imageScale={imageScale}
      cursorPosition={cursorPosition}
      scaledStrokeWidth={scaledStrokeWidth}
      setImagePosition={setImagePosition}
      onPointerDown={isDropperMode ? handleDropperPick : handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      dropperMode={isDropperMode}
    />
  ), [
    canvasSize,
    strokeColor,
    isEraser,
    isErasing,
    isAdjustMode,
    tracingActive,
    traceImage,
    imagePosition,
    imageScale,
    cursorPosition,
    scaledStrokeWidth,
    isDropperMode,
    handleDropperPick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  ]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <UploadSpinner on={isSending} />
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 overflow-y-auto">
        <div
          ref={containerRef}
          className="bg-white rounded-xl overflow-hidden w-11/12 max-w-4xl flex flex-col my-1 sm:my-2 max-h-[98vh]"
        >
          {/* Header */}
          <div className="p-1 sm:p-2 bg-gray-100 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sketch Your Page</h2>
              <DrawingTimer elapsedTime={elapsedTime} />
            </div>
          </div>

          {/* Canvas Container */}
          <div className="p-1 sm:p-2 md:p-4 flex justify-center items-center overflow-hidden bg-gray-50">
            <div className="bg-white p-1 sm:p-2 md:p-4 rounded-lg shadow-sm" style={{ position: "relative" }}>
              {/* Use the background image approach */}
              {aiGeneratedImage && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${canvasSize}px`,
                    height: `${canvasSize}px`,
                    backgroundImage: `url(${aiGeneratedImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 2,
                  }}
                />
              )}
              
              <SketchCanvas
                ref={sketchCanvasRef}
                canvasSize={canvasSize}
                strokeColor={strokeColor}
                isEraser={isEraser}
                isErasing={isErasing}
                isAdjustMode={isAdjustMode}
                tracingActive={tracingActive}
                traceImage={traceImage}
                imagePosition={imagePosition}
                imageScale={imageScale}
                cursorPosition={cursorPosition}
                scaledStrokeWidth={scaledStrokeWidth}
                setImagePosition={setImagePosition}
                onPointerDown={isDropperMode ? handleDropperPick : handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                dropperMode={isDropperMode}
              />
            </div>
          </div>
          
          {/* Error display */}
          {aiImageError && (
            <div className="p-1 text-xs text-red-500">
              Error: {aiImageError}
            </div>
          )}
          
          {/* AI image status */}
          {isAiImageLoading && (
            <div className="p-1 text-xs text-blue-500">
              Loading AI image...
            </div>
          )}

          {/* Controls */}
          <div className="p-1 sm:p-2 bg-gray-100 border-t border-gray-200 overflow-y-auto">
            <div className="max-w-[500px] mx-auto space-y-1">
              {/* Top Row - Mode Controls */}
              <div className="grid grid-cols-2 gap-1">
                {/* Draw/Adjust/Erase Toggle */}
                <DrawingModeControls
                  isEraser={isEraser}
                  isAdjustMode={isAdjustMode}
                  tracingActive={tracingActive}
                  traceImage={traceImage}
                  setIsEraser={setIsEraser}
                  setIsAdjustMode={setIsAdjustMode}
                />

                {/* Trace Button */}
                <TracingControls
                  traceImage={traceImage}
                  tracingActive={tracingActive}
                  imageScale={imageScale}
                  isAdjustMode={isAdjustMode}
                  handleTraceButtonClick={handleTraceButtonClick}
                  handleToggleTracing={handleToggleTracing}
                  handleScaleIncrease={handleScaleIncrease}
                  handleScaleDecrease={handleScaleDecrease}
                  handleAuto={handleAuto}
                  autoDisabled={!hasDrawn || isSending}
                  onImageSelect={handleImageSelect}
                  fileInputRef={sketchCanvasRef.current?.fileInputRef || { current: null }}
                />
              </div>

              {/* Pencil Grade Selector - Moved Up */}
              <PencilGradeSelector selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} />

              {/* Color Selector */}
              <ColorSelector
                baseColor={baseColor}
                setBaseColor={setBaseColor}
                customColor={customColor}
                setCustomColor={setCustomColor}
                isDropperMode={isDropperMode}
                setIsDropperMode={setIsDropperMode}
              />

              {/* Stroke Width Control (Pencil Size) */}
              <StrokeWidthControl strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />

              {/* Action Buttons */}
              <ActionButtons
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                handleClear={handleClear}
                handleSubmit={handleSubmit}
                onClose={onClose}
                handleAuto={handleAuto}
                autoDisabled={!hasDrawn || isSending}
              />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default PencilSketchPortal;
