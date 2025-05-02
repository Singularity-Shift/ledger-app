import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { toast } from "@/components/ui/use-toast";
import { useDrawingState } from "@/hooks/useDrawingState";

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
import { Spinner } from "@/components/ui/spinner";

// Import custom hooks
import useSketchTimer from "./sketch/useSketchTimer";
import useSketchExport from "./sketch/useSketchExport";
import { moderateImage } from "@/utils/imageModeration";

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

  // Add state for dropper mode
  const [isDropperMode, setIsDropperMode] = useState(false);

  // Place this at the top of the state declarations, before any function that uses autoImageUrl
  const [autoImageUrl, setAutoImageUrl] = useState<string | null>(null);

  // Initialize timer hook
  const { elapsedTime, setElapsedTime, drawingStartTime, getSecurityToken } = useSketchTimer(
    isOpen,
    isRestored,
    drawingState?.elapsedTime ?? 0,
    drawingState?.drawingStartTime // pass restored start time if available
  );

  // Initialize export hook
  const { exportMergedSketch } = useSketchExport();

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
      // No need to set drawingStartTime here, it's handled by useSketchTimer
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

  // Auto-save drawing state periodically and on drawing actions
  const saveCurrentState = useCallback(async () => {
    // Only save if the initial restoration attempt is complete
    if (!isRestored || !sketchCanvasRef.current?.canvasRef.current) {
      return;
    }

    console.log("Saving current state...");
    try {
      const paths = await sketchCanvasRef.current.canvasRef.current.exportPaths();

      saveDrawingState({
        drawingPaths: paths,
        elapsedTime: elapsedTime,
        lastActiveTimestamp: Date.now(),
        drawingStartTime: drawingStartTime, // persist start time
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
    saveDrawingState,
    toast,
    drawingStartTime, // include in deps
  ]);

  // Save state on drawing/erasing actions
  const handlePointerUp = useCallback(() => {
    setIsErasing(false);
    saveCurrentState(); // Save after drawing action completes
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

  // Unified clear handler: always confirm, always clear both sketch and auto image, always show toast
  const handleClearUnified = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your drawing? This cannot be undone.")) {
      setAutoImageUrl(null);
      setTraceImage(null);
      setTracingActive(false);
      if (sketchCanvasRef.current?.canvasRef.current) {
        sketchCanvasRef.current.canvasRef.current.clearCanvas();
      }
      setImagePosition({ x: 0, y: 0 });
      setImageScale(1);
      setElapsedTime(0);
      clearDrawingState();
      setIsRestored(true);
      toast({ title: 'Canvas Cleared', description: 'Your drawing has been cleared.' });
    }
  }, [clearDrawingState, setIsRestored, toast]);

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
      if (autoImageUrl) {
        // If auto image is present, fetch it as a blob and submit only that
        const response = await fetch(autoImageUrl);
        const blob = await response.blob();
        // Resize to 1000x1000 using a canvas
        const resizedBlob = await resizeImageBlob(blob, 1000, 1000);
        const file = new File([resizedBlob], 'auto-image.png', { type: 'image/png' });

        // Moderation step (reuse existing logic)
        const fileToDataUrl = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };
        let isFlagged = true;
        try {
          const imageDataUrl = await fileToDataUrl(file);
          isFlagged = await moderateImage(imageDataUrl);
        } catch (moderationError) {
          console.error("Error during image moderation:", moderationError);
          toast({
            variant: "destructive",
            title: "Moderation Error",
            description: `Could not check image content. Please try again. ${moderationError instanceof Error ? moderationError.message : ''}`,
          });
          return;
        }
        if (isFlagged) {
          console.warn("Image failed moderation check.");
          toast({
            variant: "destructive",
            title: "Moderation Failed",
            description: "The generated image was flagged as potentially harmful and cannot be submitted.",
          });
          return;
        }
        moderationPassed = true;
        const securityToken = getSecurityToken();
        onSubmit(
          file,
          elapsedTime,
          autoImageUrl,
          '', // id not available for auto image
          !!traceImage, // usedTracing: true if traceImage was present
          securityToken // now passing security token for auto image
        );
        toast({ title: "Success", description: "Your drawing has been submitted!" });
        setIsRestored(false);
        onClose();
        return;
      }
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
  }, [onSubmit, elapsedTime, traceImage, onClose, getSecurityToken, exportMergedSketch, canvasSize, toast, drawingStartTime, autoImageUrl]);

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

  // --- AUTO BUTTON LOGIC ---
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);

  const handleAuto = useCallback(async () => {
    if (isAutoProcessing) return;
    setIsAutoProcessing(true);
    try {
      // 1. Pause save state loop (by flag)
      // (Assume saveCurrentState checks isAutoProcessing and skips if true)

      // 2. Export required layers
      // a) Paper background (static asset)
      const fetchPaperBlob = async () => {
        const response = await fetch('/frontend/assets/placeholders/paper.png');
        return await response.blob();
      };
      const paperBlob = await fetchPaperBlob();

      // b) User sketch (export as PNG, no transparency)
      const sketchBlob = sketchCanvasRef.current?.canvasRef.current
        ? await sketchCanvasRef.current.canvasRef.current.exportImage('png').then(dataUrlToBlob)
        : null;
      if (!sketchBlob) throw new Error('Failed to export sketch layer');

      // c) Trace image (if present)
      let subjectBlob: Blob | null = null;
      if (traceImage) {
        subjectBlob = await exportTraceImageAsBlob();
      }

      // 3. Prepare FormData and call backend
      const formData = new FormData();
      formData.append('paper', paperBlob, 'paper.png');
      formData.append('sketch', sketchBlob, 'sketch.png');
      if (subjectBlob) formData.append('subject', subjectBlob, 'subject.png');

      const response = await fetch('/api/auto', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Auto-backend failed');
      const { imageUrl } = await response.json();
      if (!imageUrl) throw new Error('No image URL returned from backend');

      // 4. Replace sketch (and trace) layer with returned image
      setAutoImageUrl(imageUrl); // Overlay the image
      sketchCanvasRef.current?.canvasRef.current?.clearCanvas();
      setTraceImage(null); // Remove trace image if present
      setTracingActive(false);
      toast({ title: 'Auto Complete', description: 'AI-enhanced image has been applied. Please review and submit if satisfied.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Auto Error', description: err instanceof Error ? err.message : String(err) });
    } finally {
      setIsAutoProcessing(false);
      // 5. Resume save state loop (flag resets)
    }
  }, [isAutoProcessing, traceImage, sketchCanvasRef, toast]);

  // Helper: Convert dataURL to Blob
  function dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  }

  // Helper: Export trace image as displayed (square, full opacity)
  async function exportTraceImageAsBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const size = canvasSize;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to get canvas context'));
      const img = new window.Image();
      img.onload = () => {
        // Draw trace image as displayed (with position/scale)
        const scaledW = img.width * imageScale;
        const scaledH = img.height * imageScale;
        const x = imagePosition.x;
        const y = imagePosition.y;
        ctx.clearRect(0, 0, size, size);
        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, x, y, scaledW, scaledH);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to export trace image as blob'));
        }, 'image/png');
      };
      img.onerror = () => reject(new Error('Failed to load trace image for export'));
      img.src = traceImage!;
    });
  }

  // Helper: Resize image blob to target size using canvas
  async function resizeImageBlob(blob: Blob, width: number, height: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Failed to get canvas context for resizing'));
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((resizedBlob) => {
          if (resizedBlob) resolve(resizedBlob);
          else reject(new Error('Failed to export resized image as blob'));
        }, 'image/png');
      };
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
      img.src = URL.createObjectURL(blob);
    });
  }

  if (!isOpen) return null;

  return createPortal(
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
        <div className="p-1 sm:p-2 md:p-4 flex justify-center items-center overflow-hidden bg-gray-50" style={{ position: 'relative' }}>
          {/* Spinner overlay when auto-processing */}
          {isAutoProcessing && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.7)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Spinner size="lg" />
            </div>
          )}
          <div className="bg-white p-1 sm:p-2 md:p-4 rounded-lg shadow-sm">
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
              autoImageUrl={autoImageUrl}
            />
          </div>
        </div>

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
              showAutoButton={true}
            />

            {/* Stroke Width Control (Pencil Size) */}
            <StrokeWidthControl strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />

            {/* Action Buttons */}
            <ActionButtons
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              handleClear={handleClearUnified}
              handleSubmit={handleSubmit}
              handleAuto={handleAuto}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PencilSketchPortal;