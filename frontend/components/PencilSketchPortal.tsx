import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Paper from '@/assets/placeholders/paper.png';
import { useDrawingState } from '@/hooks/useDrawingState';

interface PencilSketchPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (imageBlob: string, drawingTime: number, usedTracing?: boolean) => void;
}

// Pencil grades with opacity levels
type PencilGrade = {
  label: string;
  opacity: number;
  description: string;
};

const PENCIL_GRADES: PencilGrade[] = [
  { label: '9H', opacity: 0.03, description: 'Hardest, faintest' },
  { label: '8H', opacity: 0.05, description: 'Ultra hard, extremely light' },
  { label: '7H', opacity: 0.07, description: 'Very very hard, very faint' },
  { label: '6H', opacity: 0.1, description: 'Extra hard, very light' },
  { label: '5H', opacity: 0.12, description: 'Very hard, light' },
  { label: '4H', opacity: 0.15, description: 'Hard, light' },
  { label: '3H', opacity: 0.2, description: 'Medium hard, light' },
  { label: '2H', opacity: 0.25, description: 'Medium hard' },
  { label: 'H', opacity: 0.3, description: 'Hard' },
  { label: 'F', opacity: 0.35, description: 'Fine, between H and HB' },
  { label: 'HB', opacity: 0.4, description: 'Medium, balanced' },
  { label: 'B', opacity: 0.55, description: 'Soft' },
  { label: '2B', opacity: 0.65, description: 'Softer, darker' },
  { label: '3B', opacity: 0.75, description: 'Very soft' },
  { label: '4B', opacity: 0.8, description: 'Very soft, dark' },
  { label: '5B', opacity: 0.85, description: 'Extra soft' },
  { label: '6B', opacity: 0.9, description: 'Extra soft, very dark' },
  { label: '7B', opacity: 0.95, description: 'Ultra soft, very dark' },
  { label: '8B', opacity: 0.97, description: 'Ultra soft, darkest' },
  { label: '9B', opacity: 1, description: 'Softest, maximum darkness' }
];

// Predefined colors
const COLORS = [
  { name: 'Graphite', value: '#333333' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Sepia', value: '#704214' },
  { name: 'Teal', value: '#008080' },
  { name: 'Brown', value: '#A52A2A' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Violet', value: '#8F00FF' },
  { name: 'Navy', value: '#000080' },
  { name: 'Forest', value: '#228B22' },
  { name: 'Maroon', value: '#800000' },
  { name: 'Gold', value: '#FFD700' }
];

// Find PencilGrade by label
const findGradeByLabel = (label: string): PencilGrade | undefined => {
  return PENCIL_GRADES.find(grade => grade.label === label);
};

export const PencilSketchPortal: React.FC<PencilSketchPortalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { drawingState, saveDrawingState, clearDrawingState, isDrawingStateLoaded } = useDrawingState();
  
  // Use state values from the hook if available, otherwise use defaults
  const [strokeWidth, setStrokeWidth] = useState(drawingState?.pencilConfig?.width ?? 2);
  const [selectedGrade, setSelectedGrade] = useState<PencilGrade>(
    (drawingState?.pencilConfig?.gradeLabel ? findGradeByLabel(drawingState.pencilConfig.gradeLabel) : undefined) ?? PENCIL_GRADES[3] // Default HB
  );
  const [baseColor, setBaseColor] = useState(drawingState?.pencilConfig?.color ?? COLORS[0].value); // Default Graphite
  const [customColor, setCustomColor] = useState(drawingState?.pencilConfig?.color ?? COLORS[0].value);
  const [isEraser, setIsEraser] = useState(drawingState?.pencilConfig?.isEraser ?? false);
  const [isErasing, setIsErasing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [elapsedTime, setElapsedTime] = useState(drawingState?.elapsedTime ?? 0);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(1000);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the interval ID
  const [isRestored, setIsRestored] = useState(false); // Flag to track if state was restored

  // Tracing feature state - initialize from hook if available
  const [traceImage, setTraceImage] = useState(drawingState?.traceImage ?? null);
  const [tracingActive, setTracingActive] = useState(drawingState?.traceConfig?.active ?? false);
  const [imagePosition, setImagePosition] = useState(drawingState?.traceConfig?.position ?? { x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(drawingState?.traceConfig?.scale ?? 1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdjustMode, setIsAdjustMode] = useState(false); // Adjust mode likely shouldn't persist

  // Calculate the actual stroke color based on the base color and opacity
  const strokeColor = useMemo(() => {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      // Remove # if present
      hex = hex.replace(/^#/, '');
      
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
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Get the container dimensions
          const containerHeight = entry.contentRect.height;
          const containerWidth = entry.contentRect.width;
          
          // Calculate available space for canvas (accounting for controls)
          const controlsHeight = 350; // Increased to account for tracing controls
          const availableHeight = Math.max(containerHeight - controlsHeight, 300);
          const availableWidth = Math.max(containerWidth - 40, 300); // 40px for padding
          
          // Calculate the reduction factor based on screen size
          const isMobile = window.innerWidth <= 768; // Standard mobile breakpoint
          
          // Apply additional size reduction for very small devices (Galaxy S8 size)
          let reductionFactor = isMobile ? 0.95 : 0.92;
          
          // Get actual window dimensions
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          
          // Further reduce size for smaller devices based on window dimensions
          if (windowHeight <= 800 || windowWidth <= 400) {
            reductionFactor = isMobile ? 0.8 : 0.75;
            
            // For extra small devices like Galaxy S8, use even smaller factor
            if (windowWidth <= 360) {
              reductionFactor = 0.7;
            }
          }
          
          // Use the smaller of width or height to maintain square aspect ratio
          // Allow larger canvas on desktop (up to 1200px)
          const maxCanvasSize = isMobile ? 900 : 1200;
          const size = Math.min(availableWidth, availableHeight, maxCanvasSize) * reductionFactor;
          setCanvasSize(size);
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
    if (isOpen && isDrawingStateLoaded && drawingState && !isRestored && canvasRef.current) {
       console.log("Attempting to restore drawing state...");
       // Load drawing paths if they exist
       if (drawingState.drawingPaths) {
         try {
           canvasRef.current.loadPaths(drawingState.drawingPaths);
           console.log("Paths loaded successfully.");
         } catch (error) {
            console.error("Error loading drawing paths:", error);
            toast({ variant: "destructive", title: "Restore Error", description: "Failed to load previous drawing paths." });
            // Optionally clear broken state if loading paths fails consistently?
            // clearDrawingState(); 
         }
       }
       // Restore other states (tool settings, trace image, timer)
       setStrokeWidth(drawingState.pencilConfig?.width ?? 2);
       const restoredGrade = drawingState.pencilConfig?.gradeLabel ? findGradeByLabel(drawingState.pencilConfig.gradeLabel) : undefined;
       setSelectedGrade(restoredGrade ?? PENCIL_GRADES[3]);
       setBaseColor(drawingState.pencilConfig?.color ?? COLORS[0].value);
       setCustomColor(drawingState.pencilConfig?.color ?? COLORS[0].value); // Set custom color picker too
       setIsEraser(drawingState.pencilConfig?.isEraser ?? false);
       setElapsedTime(drawingState.elapsedTime ?? 0);
       setTraceImage(drawingState.traceImage ?? null);
       setTracingActive(drawingState.traceConfig?.active ?? false);
       setImagePosition(drawingState.traceConfig?.position ?? { x: 0, y: 0 });
       setImageScale(drawingState.traceConfig?.scale ?? 1);

       // Mark that state has been restored *after* attempting load
       // This ensures this block only runs once per valid restoration scenario
       setIsRestored(true); 
       console.log("Drawing state restored.");
       toast({ title: "Drawing Restored", description: "Your previous drawing progress has been loaded." });

    } else if (isOpen && isDrawingStateLoaded && !drawingState && !isRestored) {
      // Condition for: Portal is open, state is loaded, NO saved state exists, and we haven't initialized yet.
      console.log("No saved state found, clearing canvas.");
      canvasRef.current?.clearCanvas();
      setElapsedTime(0); // Reset timer if no state
      // Mark as 'restored' because we've handled the initial state (empty canvas).
      // This prevents this block from running again if drawingState becomes null later.
      setIsRestored(true); 

    } else if (!isOpen) {
        // Reset isRestored flag when portal closes, allowing restoration on next open
        if (isRestored) { // Only log/reset if it was previously restored
            setIsRestored(false);
            console.log("Portal closed, reset isRestored flag.");
        }
    }
    // Dependency array includes all values read/used inside the effect that can change.
    // The !isRestored condition prevents re-execution logic despite drawingState changing.
  }, [isOpen, isDrawingStateLoaded, isRestored, drawingState, clearDrawingState, toast]);

  // Auto-save drawing state periodically and on drawing actions
  const saveCurrentState = useCallback(async () => {
    // Only save if the initial restoration attempt is complete
    if (!isRestored || !canvasRef.current) { 
        // console.log("Skipping save: Restoration not complete or canvas ref missing.");
        return;
    }
    
    console.log("Saving current state...");
    try {
        const paths = await canvasRef.current.exportPaths();
        // We might not need the complex check anymore if isRestored handles the initial phase
        // if (!isRestored && (!Array.isArray(paths) || paths.length === 0) && elapsedTime < 2) {
        //      console.log("Skipping initial save of empty canvas");
        //      return;
        // }

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
        });
        console.log("State saved.");
    } catch (error) {
        console.error("Error exporting/saving drawing state:", error);
        toast({ variant: "destructive", title: "Save Error", description: "Could not save drawing progress." });
    }
  }, [
    isRestored, // Add isRestored dependency
    elapsedTime, traceImage, tracingActive, imagePosition, imageScale,
    baseColor, strokeWidth, selectedGrade, isEraser, saveDrawingState,
    toast // Add toast as a dependency
  ]);

  // Save state on drawing/erasing actions (onPointerUp)
  const handlePointerUp = useCallback(() => {
    setIsErasing(false);
    setIsDragging(false);
    saveCurrentState(); // Save after drawing action completes
  }, [saveCurrentState]);
  
  // Save state before the window unloads
  useEffect(() => {
    const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
      // Check if there's something potentially worth saving
      if (isOpen && isRestored && canvasRef.current && elapsedTime > 0) { // Check isOpen and isRestored
          console.log("beforeunload: Triggering saveCurrentState...");
          saveCurrentState();
          // Note: Asynchronous save might not complete before unload.
          // Consider synchronous localStorage if critical, but it blocks the main thread.
          
          // Standard way to prompt user (currently disabled, but keep _event for potential future use)
          // _event.preventDefault(); 
          // _event.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save when component unmounts only if it was open and restored.
      if (isOpen && isRestored) { 
          console.log("Unmount: Triggering saveCurrentState...");
          saveCurrentState();
      }
    };
  // TypeScript sometimes has issues inferring types in the dependency array
  // explicitly list them to avoid the "implicitly has any type" warning
  }, [
    isOpen as boolean, 
    isRestored as boolean, 
    elapsedTime as number, 
    saveCurrentState as () => Promise<void>
  ]);

  // Clear state handlers (add console logs, ensure isRestored reset)
  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your drawing? This cannot be undone.")) {
        console.log("Clearing canvas and state...");
        canvasRef.current?.clearCanvas();
        setTraceImage(null); 
        setTracingActive(false);
        setImagePosition({ x: 0, y: 0 });
        setImageScale(1);
        setElapsedTime(0); 
        clearDrawingState(); 
        setIsRestored(true); // Set to true because the 'restored' state is now empty canvas
        console.log("State cleared.");
        toast({ title: "Canvas Cleared", description: "Your drawing has been cleared." });
    }
  }, [clearDrawingState]);

  const handleUndo = () => {
    canvasRef.current?.undo();
    // Consider saving state after undo/redo if needed, might be excessive
    // saveCurrentState(); 
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
    // saveCurrentState();
  };

  // Modify handleSubmit to clear state (ensure isRestored reset)
  const handleSubmit = useCallback(async () => {
    try {
      if (canvasRef.current && onSubmit) {
        console.log("Submitting drawing...");
        const data = await canvasRef.current.exportImage('png');
        onSubmit(data, elapsedTime, !!traceImage);
        toast({ title: "Success", description: "Your drawing has been submitted!" });
        clearDrawingState(); // Clear saved state on successful submit
        setIsRestored(false); // Reset restored flag so next open checks storage again
        console.log("Drawing submitted, state cleared.");
        onClose(); // Close the portal
      }
    } catch (error) {
      console.error('Error submitting drawing:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to submit your drawing." });
    }
  }, [onSubmit, elapsedTime, traceImage, clearDrawingState, onClose]);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setBaseColor(e.target.value);
  };

  const getCurrentColorName = () => {
    const foundColor = COLORS.find(c => c.value === baseColor);
    return foundColor ? foundColor.name : "Custom";
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) {
      return `${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  // Modify timer logic (remove automatic save via updateTimestamp)
  useEffect(() => {
    if (isOpen && isRestored) { // Only start timer if open and restoration attempt is complete
      console.log("Timer starting/resuming...");
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        // updateTimestamp(); // REMOVED: No need to save state on every tick
      }, 1000);
    } else {
      // Clear interval if portal is closed or before restoration is done
      if (timerIntervalRef.current) {
        console.log("Timer pausing.");
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      // Save final state when closing portal (moved to unmount/beforeunload effect)
      // if (isDrawingStateLoaded && isRestored) { 
      //      saveCurrentState();
      // }
    }

    // Cleanup function
    return () => {
      if (timerIntervalRef.current) {
        console.log("Timer cleanup.");
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isOpen, isRestored]); // Depend on isOpen and isRestored status

  // Toggle eraser mode
  useEffect(() => {
    if (canvasRef.current) {
      if (isEraser) {
        canvasRef.current.eraseMode(true);
      } else {
        canvasRef.current.eraseMode(false);
      }
    }
  }, [isEraser]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // When in adjust mode, allow dragging of tracing image
    if (isAdjustMode && tracingActive && traceImage) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - imagePosition.x,
          y: e.clientY - imagePosition.y
        });
      }
      e.preventDefault();
      return;
    }
    
    // When in draw mode with eraser active
    if (!isAdjustMode && isEraser) {
      setIsErasing(true);
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // When in adjust mode and dragging tracing image
    if (isAdjustMode && isDragging && tracingActive && traceImage) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      e.preventDefault();
      return;
    }
    
    // When in draw mode with eraser active
    if (!isAdjustMode && isEraser && isErasing) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  // Tracing image handlers (modify to save state)
  const handleTraceButtonClick = () => {
    fileInputRef.current?.click();
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
              traceConfig: { active: true, position, scale } 
          }); 
          toast({ title: "Image Selected", description: "You can now trace over this image." });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Corrected Trace Config Handlers ---
  const handleToggleTracing = () => {
    const newActiveState = !tracingActive;
    setTracingActive(newActiveState);
    // Construct a complete traceConfig object using current state
    saveDrawingState({ 
      traceConfig: { 
        active: newActiveState, 
        position: imagePosition, // Use current position state
        scale: imageScale // Use current scale state
      } 
    });
  };

  const handleScaleIncrease = () => {
    const newScale = Math.min(imageScale + 0.1, 2);
    setImageScale(newScale);
    // Construct a complete traceConfig object using current state
    saveDrawingState({ 
      traceConfig: { 
        active: tracingActive, // Use current active state
        position: imagePosition, // Use current position state
        scale: newScale 
      } 
    });
  };

  const handleScaleDecrease = () => {
    const newScale = Math.max(imageScale - 0.1, 0.5);
    setImageScale(newScale);
    // Construct a complete traceConfig object using current state
    saveDrawingState({ 
      traceConfig: { 
        active: tracingActive, // Use current active state
        position: imagePosition, // Use current position state
        scale: newScale 
      } 
    });
  };
  // --- End Corrected Handlers ---

  // Adjust mode toggle - likely doesn't need saving, but position/scale changes while adjusting do
   const handleToggleAdjustMode = () => {
    setIsAdjustMode(!isAdjustMode);
    setIsEraser(false); // Ensure eraser is off when adjusting
     // No save needed here, but saves happen on scale/drag interactions within adjust mode (handled by pointer move)
  };

  const pencilCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'%3E%3C/path%3E%3C/svg%3E") 0 24, auto`;

  const eraserCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.48 3.52a3.2 3.2 0 0 0-4.53 0L3.52 15.95a3.2 3.2 0 0 0 0 4.53l4.53-4.53 8.47-8.47 4.53-4.53a3.2 3.2 0 0 0 0-4.53z'%3E%3C/path%3E%3C/svg%3E") 0 24, auto`;

  if (!isOpen && !isDrawingStateLoaded) return null; // Don't render if not open unless loading state
  // If state is loading, maybe show a loader? For now, just don't render if not open.
  if (!isOpen) return null; 

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 overflow-y-auto"
    >
      <div ref={containerRef} className="bg-white rounded-xl overflow-hidden w-11/12 max-w-4xl flex flex-col my-2 max-h-[98vh]">
        <div className="p-2 bg-gray-100 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Sketch Your Page</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Time:</span>
              <div className="px-2 py-1 text-xs sm:text-sm border rounded bg-white text-center font-medium min-w-[60px]">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-2 md:p-4 flex justify-center items-center overflow-hidden bg-gray-50">
          <div className="bg-white p-2 md:p-4 rounded-lg shadow-sm">
            <div 
              ref={canvasContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{
                width: `${canvasSize}px`,
                height: `${canvasSize}px`,
                border: '2px solid black',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
                cursor: isAdjustMode && tracingActive ? 'move' : isEraser ? eraserCursor : pencilCursor,
              }}
            >
              {/* Background layer (paper) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${Paper})`,
                  backgroundSize: 'cover',
                  zIndex: 1
                }}
              />
              
              {/* Trace image layer - conditionally rendered */}
              {tracingActive && traceImage && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.35,
                    zIndex: 2,
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={traceImage}
                    alt="Tracing Reference"
                    style={{
                      position: 'absolute',
                      transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                      transformOrigin: 'center',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                </div>
              )}
              
              <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={scaledStrokeWidth}
                strokeColor={strokeColor}
                width={`${canvasSize}`}
                height={`${canvasSize}`}
                backgroundImage=""
                exportWithBackgroundImage={false}
                canvasColor="transparent"
                eraserWidth={scaledStrokeWidth}
                allowOnlyPointerType="all"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 3
                }}
              />
              
              {/* Block overlay to prevent drawing when in adjust mode */}
              {isAdjustMode && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    cursor: 'move'
                  }}
                  onPointerDown={(e) => {
                    if (tracingActive && traceImage) {
                      const rect = canvasContainerRef.current?.getBoundingClientRect();
                      if (rect) {
                        setIsDragging(true);
                        setDragStart({
                          x: e.clientX - imagePosition.x,
                          y: e.clientY - imagePosition.y
                        });
                      }
                    }
                    e.stopPropagation();
                  }}
                  onPointerMove={(e) => {
                    if (isDragging && tracingActive && traceImage) {
                      setImagePosition({
                        x: e.clientX - dragStart.x,
                        y: e.clientY - dragStart.y
                      });
                    }
                    e.stopPropagation();
                  }}
                  onPointerUp={(e) => {
                    setIsDragging(false);
                    e.stopPropagation();
                  }}
                  onPointerLeave={(e) => {
                    setIsDragging(false);
                    e.stopPropagation();
                  }}
                />
              )}
              
              {isEraser && isErasing && (
                <div 
                  className="pointer-events-none absolute"
                  style={{
                    width: `${scaledStrokeWidth * 2}px`,
                    height: `${scaledStrokeWidth * 2}px`,
                    border: '2px solid rgba(0, 0, 0, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    left: cursorPosition.x,
                    top: cursorPosition.y,
                    zIndex: 100,
                    pointerEvents: 'none'
                  }}
                />
              )}
              
              {/* Hidden file input for image selection */}
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
        
        <div className="p-2 bg-gray-100 border-t border-gray-200 overflow-y-auto">
          <div className="max-w-[500px] mx-auto space-y-1">
            {/* Top Row - Mode Controls */}
            <div className="grid grid-cols-2 gap-1">
              {/* Draw/Adjust/Erase Toggle */}
              <div>
                <label className="text-xs font-medium mb-1 block">Mode:</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setIsEraser(false);
                      setIsAdjustMode(false);
                    }}
                    className={`px-2 py-1 text-xs sm:text-sm border rounded-l flex-1 ${
                      !isEraser && !isAdjustMode
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    ✏️ Draw
                  </button>
                  <button
                    onClick={() => {
                      setIsEraser(true);
                      setIsAdjustMode(false);
                    }}
                    className={`px-2 py-1 text-xs sm:text-sm border flex-1 ${
                      isEraser && !isAdjustMode
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white'
                    } hover:bg-gray-100 transition-colors`}
                    disabled={isAdjustMode}
                  >
                    ⚪ Erase
                  </button>
                  <button
                    onClick={handleToggleAdjustMode}
                    className={`px-2 py-1 text-xs sm:text-sm border rounded-r flex-1 ${
                      isAdjustMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    disabled={!tracingActive || !traceImage}
                  >
                    🔍 Adjust
                  </button>
                </div>
              </div>
              
              {/* Trace Button */}
              <div>
                <label className="text-xs font-medium mb-1 block">Tracing:</label>
                <div className="flex gap-1">
                  <button
                    onClick={handleTraceButtonClick}
                    className="flex-1 px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded-l bg-white hover:bg-gray-100 transition-colors"
                  >
                    📷 Trace
                  </button>
                  <button
                    onClick={handleToggleTracing}
                    disabled={!traceImage}
                    className={`flex-1 px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded-r ${
                      tracingActive && traceImage
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white'
                    } hover:bg-gray-100 transition-colors ${!traceImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {tracingActive ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tracing controls - conditionally rendered */}
            {isAdjustMode && traceImage && tracingActive && (
              <div className="border rounded p-2 bg-gray-50">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium">Adjust Image:</label>
                  <div className="flex gap-1">
                    <button
                      onClick={handleScaleDecrease}
                      className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100"
                    >
                      🔍-
                    </button>
                    <div className="text-xs px-2 py-1 bg-white border rounded">
                      {Math.round(imageScale * 100)}%
                    </div>
                    <button
                      onClick={handleScaleIncrease}
                      className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100"
                    >
                      🔍+
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1 text-center italic">
                  Drag image to position
                </div>
              </div>
            )}

            {/* Middle Row - Color and Size */}
            <div className="grid grid-cols-2 gap-1">
              {/* Selected Color Display */}
              <div>
                <label className="text-xs font-medium mb-1 block">Selected Color:</label>
                <div className="flex items-center gap-2 px-2 py-1 border rounded bg-white">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: baseColor }}
                  />
                  <span className="text-xs sm:text-sm">{getCurrentColorName()}</span>
                </div>
              </div>

              {/* Pencil Size */}
              <div>
                <label className="text-xs font-medium mb-1 block">Size: {strokeWidth}px</label>
                <input
                  type="range"
                  min="0.5"
                  max="16"
                  step="0.5"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full h-6"
                />
              </div>
            </div>

            {/* Pencil Grade Selector */}
            <div>
              <label className="text-xs font-medium mb-1 block">Pencil Grade:</label>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {PENCIL_GRADES.map((grade) => (
                  <button
                    key={grade.label}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-1 py-0.5 text-xs border rounded ${
                      selectedGrade.label === grade.label 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white'
                    } hover:bg-gray-100 transition-colors`}
                    title={grade.description}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Palette */}
            <div>
              <label className="text-xs font-medium mb-1 block">Color Palette:</label>
              <div className="grid grid-cols-9 sm:grid-cols-10 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBaseColor(color.value)}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border ${
                      baseColor === color.value 
                        ? 'border-black ring-1 ring-offset-1 ring-gray-400' 
                        : 'border-gray-300'
                    } transition-all duration-150 hover:scale-110`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                  <button
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border ${
                      !COLORS.find(c => c.value === baseColor)
                        ? 'border-black ring-1 ring-offset-1 ring-gray-400'
                        : 'border-gray-300'
                    } bg-gradient-to-br from-red-500 via-green-500 to-blue-500 transition-all duration-150 hover:scale-110`}
                    title="Custom color"
                  />
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-1 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUndo}
                className="min-w-[50px] h-8 text-xs"
              >
                Undo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRedo}
                className="min-w-[50px] h-8 text-xs"
              >
                Redo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClear}
                className="min-w-[50px] h-8 text-xs"
              >
                Clear
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSubmit}
                className="min-w-[50px] h-8 text-xs"
              >
                Submit
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={onClose}
                className="min-w-[50px] h-8 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}; 
