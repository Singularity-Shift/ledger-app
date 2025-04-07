import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Stage, Layer, Line, Image as KonvaImage, Transformer } from "react-konva";
import Konva from "konva"; // Import Konva namespace for type hints and core functionalities
import useImage from "use-image"; // Helper hook for loading images in Konva
import Paper from '@/assets/placeholders/paper.png'; // Re-import Paper asset

// Keep relevant existing types/imports
import { PencilGrade } from "./sketchTypes"; // Assuming this is still relevant for opacity
import { findGradeByLabel, PENCIL_GRADES, COLORS, pencilCursor, eraserCursor } from "./sketchConstants"; // Re-import cursor constants

// --- Remove react-sketch-canvas imports ---
// import { ReactSketchCanvas, ReactSketchCanvasRef, ReactSketchCanvasProps } from "react-sketch-canvas";

// New Props for Konva-based canvas
interface SketchCanvasProps {
  canvasSize: number;
  strokeColor: string; // Expecting rgba format including opacity now
  isEraser: boolean;
  isErasing: boolean; // Keep for potential eraser cursor/visuals
  isAdjustMode: boolean;
  tracingActive: boolean;
  traceImage: string | null; // Base64 string or URL
  imagePosition: { x: number; y: number };
  imageScale: number;
  cursorPosition: { x: number; y: number }; // Keep for potential custom cursor
  scaledStrokeWidth: number;
  setImagePosition: (position: { x: number; y: number }) => void; // Keep for trace image adjustment
  setImageScale: (scale: number) => void; // Added prop to update scale from here
  onPointerDown?: (e: Konva.KonvaEventObject<PointerEvent>) => void; // Update event type
  onPointerMove?: (e: Konva.KonvaEventObject<PointerEvent>) => void; // Update event type
  onPointerUp?: (e: Konva.KonvaEventObject<PointerEvent>) => void; // Update event type
  // Potentially add more Konva specific callbacks if needed
}

// Define the type for the forwarded ref handle
export interface SketchCanvasHandle {
  stageRef: React.RefObject<Konva.Stage>;
  drawingLayerRef: React.RefObject<Konva.Layer>;
  traceLayerRef: React.RefObject<Konva.Layer>;
  // Potentially add methods like clearCanvas, undo, redo, export etc. later
  clearCanvas: () => void;
  undo: () => void; // Add undo method signature
  redo: () => void; // Add redo method signature
  // Add methods for export if needed later
  // Keep fileInputRef if tracing upload button stays here, otherwise remove/move
  // fileInputRef: React.RefObject<HTMLInputElement>;
}

export const SketchCanvas = forwardRef<SketchCanvasHandle, SketchCanvasProps>(
  (
    {
      canvasSize,
      strokeColor,
      isEraser,
      isErasing, // Keep for cursor/visuals
      isAdjustMode,
      tracingActive,
      traceImage,
      imagePosition,
      imageScale,
      cursorPosition, // Keep for cursor/visuals
      scaledStrokeWidth,
      setImagePosition, // Keep for trace image
      setImageScale, // Destructure new prop
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    ref,
  ) => {
    const stageRef = useRef<Konva.Stage>(null);
    const drawingLayerRef = useRef<Konva.Layer>(null);
    const traceLayerRef = useRef<Konva.Layer>(null);
    const imageRef = useRef<Konva.Image>(null); // Ref for the trace image
    const transformerRef = useRef<Konva.Transformer>(null); // Ref for the transformer
    // const fileInputRef = useRef<HTMLInputElement>(null); // Keep if trace upload button is here

    const [lines, setLines] = useState<Konva.LineConfig[]>([]);
    const [currentLine, setCurrentLine] = useState<number[] | null>(null); // Store points [x1, y1, x2, y2, ...]
    const isDrawing = useRef(false);

    // State for redo functionality
    const [redoStack, setRedoStack] = useState<Konva.LineConfig[]>([]);

    // Load trace image using useImage hook
    const [loadedTraceImage] = useImage(traceImage || ""); // Pass empty string if null

    // Attach transformer to image when in adjust mode
    useEffect(() => {
      if (isAdjustMode && tracingActive && imageRef.current && transformerRef.current) {
        transformerRef.current.nodes([imageRef.current]);
        transformerRef.current.getLayer()?.batchDraw();
      } else {
        // Detach transformer if not in adjust mode or tracing inactive
        transformerRef.current?.nodes([]);
      }
    }, [isAdjustMode, tracingActive, loadedTraceImage]); // Rerun when mode/image changes

    // Expose methods and refs via useImperativeHandle
    useImperativeHandle(ref, () => ({
      stageRef,
      drawingLayerRef,
      traceLayerRef,
      // fileInputRef, // Expose if needed
      clearCanvas: () => {
        setLines([]); // Clear internal React state for lines
        setRedoStack([]); // Clear redo stack as well
        const layer = drawingLayerRef.current;
        if (layer) {
            layer.destroyChildren(); // Clear Konva layer directly
            layer.draw(); // Redraw the empty layer
        }
      },
      undo: () => {
        setLines((prevLines) => {
          if (prevLines.length === 0) {
            return []; // Nothing to undo
          }
          const lastLine = prevLines[prevLines.length - 1];
          // Add the undone line to the redo stack
          setRedoStack((prevRedo) => [...prevRedo, lastLine]);
          return prevLines.slice(0, -1); // Return new array without the last line
        });
      },
      redo: () => {
        setRedoStack((prevRedo) => {
          if (prevRedo.length === 0) {
            return []; // Nothing to redo
          }
          const lineToRedo = prevRedo[prevRedo.length - 1];
          // Add the redone line back to the main lines state
          setLines((prevLines) => [...prevLines, lineToRedo]);
          return prevRedo.slice(0, -1); // Return new array without the redone line
        });
      },
      // Add loadPaths equivalent later if needed for restoring state
      // Add export methods later
    }));

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      // Prevent drawing when clicking on the transformer
      if (e.target instanceof Konva.Transformer) {
        return;
      }
      // Prevent drawing when in adjust mode and clicking the image
      if (isAdjustMode && e.target === imageRef.current) {
        return;
      }

      // Prevent drawing when in trace image adjust mode
      if (isAdjustMode) return;

      isDrawing.current = true;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      setCurrentLine([pos.x, pos.y]); // Start a new line with the initial point

      // Call external handler if provided
      // Note: Konva events are different from react-sketch-canvas, adjust parent accordingly
      // onPointerDown?.(e); // Pass the Konva event object
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!isDrawing.current || isAdjustMode) return;

      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();
      if (!point || !currentLine) return;

      // Add new points to the current line's points array
      setCurrentLine(currentLine.concat([point.x, point.y]));

      // Call external handler if provided
      // onPointerMove?.(e); // Pass the Konva event object
    };

    const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (isDrawing.current && !isAdjustMode) {
        if (currentLine && currentLine.length > 2) { // Ensure there are at least two points
          // Create a new line config object and add it to the state
          const newLine: Konva.LineConfig = {
            points: currentLine,
            stroke: strokeColor,
            strokeWidth: scaledStrokeWidth,
            tension: 0.5, // Optional: adds smoothing
            lineCap: "round",
            lineJoin: "round",
            globalCompositeOperation: isEraser ? "destination-out" : "source-over",
          };
          setLines([...lines, newLine]);
          // Clear the redo stack whenever a new line is drawn
          setRedoStack([]);
        }

        setCurrentLine(null); // Reset current line
        isDrawing.current = false;

        // Call external handler AFTER adding the line to state
        onPointerUp?.(e); // Pass the Konva event object
      }
    };

    // Handlers for image transformation
    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
      setImagePosition({ x: e.target.x(), y: e.target.y() });
    };

    const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
      const node = imageRef.current;
      if (node) {
        const newScale = node.scaleX(); // Assuming uniform scaling
        setImagePosition({ x: node.x(), y: node.y() });
        setImageScale(newScale);
      }
    };

    // Determine cursor style based on mode
    const cursorStyle = isAdjustMode && tracingActive
      ? 'move'
      : isEraser
      ? eraserCursor // Use imported constant
      : pencilCursor; // Use imported constant

    return (
      // Container div for positioning background and stage
      <div
        style={{
          width: `${canvasSize}px`,
          height: `${canvasSize}px`,
          position: 'relative',
          border: '1px solid #ccc',
          overflow: 'hidden',
          cursor: cursorStyle, // Apply dynamic cursor style here
        }}
      >
        {/* Background Paper Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${Paper})`,
            backgroundSize: 'cover',
            zIndex: 0, // Ensure it's behind the stage
          }}
        />
        {/* Konva Stage - Should be transparent by default */}
        <Stage
          width={canvasSize}
          height={canvasSize}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} // Position stage above background
          // style={{ touchAction: "manipulation" }} // Previous style, might conflict with absolute positioning
        >
          {/* Layer for Tracing Image */}
          <Layer ref={traceLayerRef}>
            {tracingActive && loadedTraceImage && (
              <KonvaImage
                ref={imageRef} // Assign ref
                image={loadedTraceImage}
                x={imagePosition.x}
                y={imagePosition.y}
                scaleX={imageScale}
                scaleY={imageScale}
                draggable={isAdjustMode} // Enable dragging only in adjust mode
                onDragEnd={handleDragEnd} // Update position on drag end
                onTransformEnd={handleTransformEnd} // Update scale/position on transform end
              />
            )}
            {/* Add Transformer only when needed */}
            {isAdjustMode && tracingActive && (
              <Transformer
                 ref={transformerRef}
                 boundBoxFunc={(oldBox, newBox) => {
                   // Limit resize scale if needed
                   // Example: if (newBox.width < 10 || newBox.height < 10) {
                   //   return oldBox;
                   // }
                   return newBox;
                 }}
              />
            )}
          </Layer>

          {/* Layer for User Drawing */}
          <Layer ref={drawingLayerRef}>
            {lines.map((line, i) => (
              <Line key={i} {...line} />
            ))}
            {/* Render the currently drawing line in real-time */}
            {currentLine && currentLine.length > 2 && (
               <Line
                 points={currentLine}
                 stroke={strokeColor}
                 strokeWidth={scaledStrokeWidth}
                 tension={0.5}
                 lineCap="round"
                 lineJoin="round"
                 globalCompositeOperation={isEraser ? "destination-out" : "source-over"}
               />
             )}
          </Layer>
        </Stage>
        {/* Eraser cursor visual */}
        {isEraser && isErasing && (
          <div
            className="pointer-events-none absolute"
            style={{
              width: `${scaledStrokeWidth * 2}px`,
              height: `${scaledStrokeWidth * 2}px`,
              border: "2px solid rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              left: cursorPosition.x,
              top: cursorPosition.y,
              zIndex: 100, // Ensure it's above the stage
              pointerEvents: "none", // Make sure it doesn't interfere with Konva events
            }}
          />
        )}
        {/* Optional: Keep file input here if needed */}
        {/* <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={onImageSelect} /> */}
      </div>
    );
  },
);

SketchCanvas.displayName = "SketchCanvas"; // Add display name

export default SketchCanvas; 