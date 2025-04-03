import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import Paper from '@/assets/placeholders/paper.png';
import TraceImageLayer from './TraceImageLayer';
import { pencilCursor, eraserCursor } from './sketchConstants';

interface SketchCanvasProps {
  canvasSize: number;
  strokeColor: string;
  isEraser: boolean;
  isErasing: boolean;
  isAdjustMode: boolean;
  tracingActive: boolean;
  traceImage: string | null;
  imagePosition: { x: number; y: number };
  imageScale: number;
  cursorPosition: { x: number; y: number };
  scaledStrokeWidth: number;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export interface SketchCanvasHandle {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
}

export const SketchCanvas = forwardRef<SketchCanvasHandle, SketchCanvasProps>(
  (
    {
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
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
    },
    ref,
  ) => {
    const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
    const canvasContainerRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Setup eraser mode when it changes
    useEffect(() => {
      if (canvasRef.current) {
        if (isEraser) {
          canvasRef.current.eraseMode(true);
        } else {
          canvasRef.current.eraseMode(false);
        }
      }
    }, [isEraser]);

    // Expose refs to parent
    useImperativeHandle(ref, () => ({
      canvasRef,
      fileInputRef,
      canvasContainerRef,
    }));

    return (
      <div
        ref={canvasContainerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave || onPointerUp}
        style={{
          width: `${canvasSize}px`,
          height: `${canvasSize}px`,
          border: "2px solid black",
          borderRadius: "4px",
          position: "relative",
          overflow: "hidden",
          cursor: isAdjustMode && tracingActive ? "move" : isEraser ? eraserCursor : pencilCursor,
        }}
      >
        {/* Background layer (paper) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${Paper})`,
            backgroundSize: "cover",
            zIndex: 1,
          }}
        />

        {/* Trace image layer */}
        <TraceImageLayer
          traceImage={traceImage}
          tracingActive={tracingActive}
          imagePosition={imagePosition}
          imageScale={imageScale}
        />

        {/* Drawing canvas */}
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
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 3,
          }}
        />

        {/* Block overlay to prevent drawing when in adjust mode */}
        {isAdjustMode && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              cursor: "move",
            }}
          />
        )}

        {/* Eraser cursor */}
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
              zIndex: 100,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Hidden file input for image selection */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    );
  },
);

SketchCanvas.displayName = 'SketchCanvas';

export default SketchCanvas; 