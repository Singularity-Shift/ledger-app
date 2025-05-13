import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Line as KonvaLine, Image as KonvaImage } from 'react-konva';
import Paper from '@/assets/placeholders/paper.png';
import { pencilCursor, eraserCursor } from './sketchConstants';
import Konva from 'konva';

interface SketchCanvasProps {
  canvasSize: number;
  strokeColor: string;
  isEraser: boolean;
  isErasing: boolean;
  isAdjustMode: boolean;
  tracingActive: boolean;
  traceImage: string | null;
  imagePosition: { x: number; y: number };
  setImagePosition: (position: { x: number; y: number }) => void;
  imageScale: number;
  cursorPosition: { x: number; y: number };
  scaledStrokeWidth: number;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLDivElement>) => void;
  dropperMode?: boolean;
  autoImageUrl?: string | null;
}

export interface SketchCanvasHandle {
  stageRef: React.RefObject<Konva.Stage>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<{
    exportPaths: () => DrawnPath[];
    exportImage: (mimeType: string) => string;
    clearCanvas: () => void;
    loadPaths: (paths: DrawnPath[]) => void;
    undo: () => void;
    redo: () => void;
  }>;
  clearCanvas: () => void;
  exportPaths: () => Array<{ points: number[]; strokeColor: string; strokeWidth: number; isEraser: boolean }>;
  exportImage: (mimeType: string) => string;
  exportDrawingLayer: (mimeType: string) => string;
  loadPaths: (paths: any[]) => void;
  undo: () => void;
  redo: () => void;
}

interface DrawnPath {
  points: number[];
  strokeColor: string;
  strokeWidth: number;
  isEraser: boolean;
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
      setImagePosition,
      imageScale,
      cursorPosition,
      scaledStrokeWidth,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
      dropperMode,
      autoImageUrl,
    },
    ref,
  ) => {
    const canvasContainerRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const stageRef = React.useRef<Konva.Stage>(null);
    // Add a ref for the drawing layer
    const drawingLayerRef = React.useRef<Konva.Layer>(null);

    const [paperImageObj, setPaperImageObj] = useState<HTMLImageElement | null>(null);
    useEffect(() => {
      const img = new window.Image();
      img.src = Paper;
      img.onload = () => setPaperImageObj(img);
    }, []);

    const [autoImageObj, setAutoImageObj] = useState<HTMLImageElement | null>(null);
    useEffect(() => {
      if (autoImageUrl) {
        const img = new window.Image();
        img.src = autoImageUrl;
        img.onload = () => setAutoImageObj(img);
      } else {
        setAutoImageObj(null);
      }
    }, [autoImageUrl]);

    const [traceImageObj, setTraceImageObj] = useState<HTMLImageElement | null>(null);
    useEffect(() => {
      if (tracingActive && traceImage) {
        const img = new window.Image();
        img.src = traceImage;
        img.onload = () => setTraceImageObj(img);
        } else {
        setTraceImageObj(null);
      }
    }, [tracingActive, traceImage]);

    const [drawnPaths, setDrawnPaths] = useState<DrawnPath[]>([]);
    const [redoStack, setRedoStack] = useState<DrawnPath[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    // Backward compatibility ref for ReactSketchCanvasRef-like API
    const compatCanvasRef = React.useRef<{
      exportPaths: () => DrawnPath[];
      exportImage: (mimeType: string) => string;
      clearCanvas: () => void;
      loadPaths: (paths: DrawnPath[]) => void;
      undo: () => void;
      redo: () => void;
    }>(
      {
        exportPaths: () => [],
        exportImage: () => '',
        clearCanvas: () => {},
        loadPaths: () => {},
        undo: () => {},
        redo: () => {},
      }
    );

    useImperativeHandle(ref, () => ({
      stageRef,
      fileInputRef,
      canvasContainerRef,
      // Backward compatibility property:
      canvasRef: compatCanvasRef,
      clearCanvas: () => {
        setDrawnPaths([]);
        setRedoStack([]);
      },
      exportPaths: () => drawnPaths,
      exportImage: (mimeType: string) => stageRef.current?.toDataURL({ mimeType }) || '',
      // New: export only the drawing layer
      exportDrawingLayer: (mimeType: string) => drawingLayerRef.current?.toDataURL({ mimeType }) || '',
      loadPaths: (paths: DrawnPath[]) => {
        setDrawnPaths(paths);
        setRedoStack([]);
      },
      undo: () => {
        setDrawnPaths((prev) => {
          if (prev.length === 0) return prev;
          const copy = [...prev];
          const removed = copy.pop() as DrawnPath;
          setRedoStack((r) => [...r, removed]);
          return copy;
        });
      },
      redo: () => {
        setRedoStack((prev) => {
          if (prev.length === 0) return prev;
          const copy = [...prev];
          const restored = copy.pop() as DrawnPath;
          setDrawnPaths((d) => [...d, restored]);
          return copy;
        });
      },
    }));

    // Initialize compatCanvasRef.current to match our API
    useEffect(() => {
      if (compatCanvasRef.current) {
        compatCanvasRef.current.clearCanvas = () => {
          setDrawnPaths([]);
          setRedoStack([]);
        };
        compatCanvasRef.current.exportPaths = () => drawnPaths;
        compatCanvasRef.current.exportImage = (mimeType: string) => stageRef.current?.toDataURL({ mimeType }) || '';
        compatCanvasRef.current.loadPaths = (paths: DrawnPath[]) => {
          setDrawnPaths(paths);
          setRedoStack([]);
        };
        compatCanvasRef.current.undo = () => {
          setDrawnPaths((prev) => {
            if (prev.length === 0) return prev;
            const copy = [...prev];
            const removed = copy.pop() as DrawnPath;
            setRedoStack((r) => [...r, removed]);
            return copy;
          });
        };
        compatCanvasRef.current.redo = () => {
          setRedoStack((prev) => {
            if (prev.length === 0) return prev;
            const copy = [...prev];
            const restored = copy.pop() as DrawnPath;
            setDrawnPaths((d) => [...d, restored]);
            return copy;
          });
        };
      }
    }, [drawnPaths, redoStack]);

    // Unified handler for both mouse and touch events
    const handlePointerEvent = (evt: Konva.KonvaEventObject<any>) => {
      const domEvent = evt.evt as unknown as React.PointerEvent<HTMLDivElement> | TouchEvent;
      const eventType = evt.type;
      
      // Forward event to parent handlers
      if (eventType.includes('down') || eventType.includes('start')) {
        onPointerDown(domEvent as any);
        if (dropperMode) return;
        
        // Begin drawing if not in adjust mode
        if (!isAdjustMode) {
          const pos = stageRef.current?.getPointerPosition();
          if (pos) {
            const newPath: DrawnPath = { points: [pos.x, pos.y], strokeColor, strokeWidth: scaledStrokeWidth, isEraser };
            setDrawnPaths(prev => [...prev, newPath]);
            setIsDrawing(true);
            setRedoStack([]);
          }
        }
      } 
      else if (eventType.includes('move')) {
        onPointerMove(domEvent as any);
        if (dropperMode || isAdjustMode) return;
        
        if (isDrawing) {
          const pos = stageRef.current?.getPointerPosition();
          if (pos) {
            setDrawnPaths(prev => {
              const paths = [...prev];
              const last = paths[paths.length - 1];
              if (last) last.points = [...last.points, pos.x, pos.y];
              return paths;
            });
          }
        }
      } 
      else if (eventType.includes('up') || eventType.includes('end')) {
        onPointerUp(domEvent as any);
        if (!isAdjustMode) setIsDrawing(false);
      }
    };

    return (
      <div
        ref={canvasContainerRef}
        onPointerDown={isAdjustMode || dropperMode ? undefined : onPointerDown}
        onPointerMove={isAdjustMode || dropperMode ? undefined : onPointerMove}
        onPointerUp={isAdjustMode || dropperMode ? undefined : onPointerUp}
        onPointerLeave={isAdjustMode || dropperMode ? undefined : (onPointerLeave || onPointerUp)}
        style={{
          width: `${canvasSize}px`,
          height: `${canvasSize}px`,
          border: '2px solid black',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
          cursor: dropperMode ? 'crosshair' : (isAdjustMode && tracingActive ? 'move' : isEraser ? eraserCursor : pencilCursor),
        }}
      >
        {/* Background layer (paper), auto image, trace, and drawing within Konva Stage */}
        <Stage
          ref={stageRef}
          width={canvasSize}
          height={canvasSize}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            zIndex: 3,
            touchAction: 'none', // Disable browser touch handling
            userSelect: 'none' // Prevent text selection
          }}
          // Mouse events
          onMouseDown={handlePointerEvent}
          onMouseMove={handlePointerEvent}
          onMouseUp={handlePointerEvent}
          onMouseLeave={evt => {
            const domEvent = evt.evt as unknown as React.PointerEvent<HTMLDivElement>;
            onPointerLeave ? onPointerLeave(domEvent) : onPointerUp(domEvent);
            if (isDrawing) setIsDrawing(false);
          }}
          // Touch events
          onTouchStart={handlePointerEvent}
          onTouchMove={handlePointerEvent}
          onTouchEnd={handlePointerEvent}
        >
          {/* Paper and Auto Image Layer */}
          <Layer>
            {paperImageObj && <KonvaImage image={paperImageObj} width={canvasSize} height={canvasSize} />}
            {autoImageObj && <KonvaImage image={autoImageObj} width={canvasSize} height={canvasSize} />}
          </Layer>
          {/* Trace Image Layer */}
          <Layer>
            {traceImageObj && (() => {
              // Calculate aspect-ratio preserving fit
              const imgW = traceImageObj.width;
              const imgH = traceImageObj.height;
              const canvasW = canvasSize;
              const canvasH = canvasSize;
              let displayW = canvasW;
              let displayH = canvasH;
              if (imgW && imgH) {
                const imgAspect = imgW / imgH;
                const canvasAspect = canvasW / canvasH;
                if (imgAspect > canvasAspect) {
                  // Image is wider
                  displayW = canvasW;
                  displayH = canvasW / imgAspect;
                } else {
                  // Image is taller
                  displayH = canvasH;
                  displayW = canvasH * imgAspect;
                }
              }
              // Center the image by default, then apply user offset
              const offsetX = (canvasW - displayW) / 2 + imagePosition.x;
              const offsetY = (canvasH - displayH) / 2 + imagePosition.y;
              return (
                <KonvaImage
                  image={traceImageObj}
                  x={offsetX}
                  y={offsetY}
                  width={displayW}
                  height={displayH}
                  scaleX={imageScale}
                  scaleY={imageScale}
                  opacity={0.35}
                  draggable={isAdjustMode}
                  listening={isAdjustMode}
                  onDragMove={e => {
                    const pos = e.target.position();
                    setImagePosition({ x: pos.x - (canvasW - displayW) / 2, y: pos.y - (canvasH - displayH) / 2 });
            }}
          />
              );
            })()}
          </Layer>
          {/* Drawing Layer */}
          <Layer ref={drawingLayerRef}>
            {drawnPaths.map((path, i) => (
              <KonvaLine
                key={i}
                points={path.points}
                stroke={path.strokeColor}
                strokeWidth={path.strokeWidth}
                globalCompositeOperation={path.isEraser ? 'destination-out' : 'source-over'}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </Layer>
        </Stage>

        {/* Eraser cursor circle */}
        {isEraser && isErasing && (
          <div
            className="pointer-events-none absolute"
            style={{
              width: `${scaledStrokeWidth * 2}px`,
              height: `${scaledStrokeWidth * 2}px`,
              border: '2px solid rgba(0,0,0,0.8)',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              transform: 'translate(-50%,-50%)',
              left: cursorPosition.x,
              top: cursorPosition.y,
              zIndex: 100,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    );
  },
);

SketchCanvas.displayName = 'SketchCanvas';

export default SketchCanvas; 