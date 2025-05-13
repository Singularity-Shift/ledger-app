import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Line as KonvaLine, Image as KonvaImage } from 'react-konva';
import Paper from '@/assets/placeholders/paper.png';
import { pencilCursor, eraserCursor, paintBucketCursor, smudgeCursor } from './sketchConstants';
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
  isPaintBucketActive?: boolean;
  isSmudgeActive?: boolean;
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
  fillAt: (x: number, y: number, color: string) => void;
}

interface DrawnPath {
  points: number[];
  strokeColor: string;
  strokeWidth: number;
  isEraser: boolean;
  fillImageDataUrl?: string;
}

// Helper component to load image from data URL for Konva.Image
const KonvaImageFromUrl: React.FC<{
  src: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
}> = ({ src, width, height, x, y }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.onload = () => {
      setImage(img);
      setError(false);
    };
    img.onerror = () => {
      console.error(`Failed to load image from data URL: ${src.substring(0, 100)}...`);
      setImage(null);
      setError(true);
    };
    img.src = src;
    // Cleanup function to revoke object URL if src were an object URL (not strictly needed for data URLs but good practice)
    return () => {
      setImage(null); // Prevent updates on unmounted component
    };
  }, [src]);

  if (error) return null; // Don't render if image failed to load
  if (!image) return null; // Don't render until image is loaded

  return <KonvaImage image={image} width={width} height={height} x={x} y={y} />;
};

// NEW ASYNC HELPER FUNCTION
const createSmudgeBaseDataURL = async (
    currentDrawnPaths: DrawnPath[], 
    currentCanvasSize: number,
    cacheMap: Map<string, Promise<HTMLImageElement>>
): Promise<string> => {
    const tempStageNode = document.createElement('div');
    // Note: Konva Stage needs a container in the DOM to function correctly, even if off-screen.
    // However, for toDataURL, it might work without appending. If issues arise, append and hide.
    // For safety, let's append it temporarily and remove it.
    // tempStageNode.style.position = 'absolute';
    // tempStageNode.style.left = '-9999px';
    // tempStageNode.style.top = '-9999px';
    // document.body.appendChild(tempStageNode);

    const tempStage = new Konva.Stage({
        container: tempStageNode, // Konva requires a container element
        width: currentCanvasSize,
        height: currentCanvasSize,
    });
    const tempLayer = new Konva.Layer();
    tempStage.add(tempLayer);

    // const imageLoadPromises: Promise<void>[] = []; // OLD
    const imageElementAndNodePromises: Promise<{ konvaNode: Konva.Image, htmlImg: HTMLImageElement }>[] = [];

    for (const path of currentDrawnPaths) {
        if (path.fillImageDataUrl) {
            const imageUrl = path.fillImageDataUrl;
            
            // Create the Konva.Image node first, add to layer
            const konvaImgNode = new Konva.Image({
                width: currentCanvasSize,
                height: currentCanvasSize,
                image: undefined, // Will be populated after promise resolves
            });
            tempLayer.add(konvaImgNode);

            let imagePromise: Promise<HTMLImageElement>;

            if (cacheMap.has(imageUrl)) {
                imagePromise = cacheMap.get(imageUrl)!;
            } else {
                imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
                    const htmlImg = new window.Image();
                    htmlImg.onload = () => {
                        resolve(htmlImg);
                    };
                    htmlImg.onerror = (err) => {
                        console.error(`Error loading image for temp smudge base (URL: ${imageUrl.substring(0,100)}...):`, err);
                        cacheMap.delete(imageUrl);
                        reject(err instanceof Event ? new Error(`Image load failed for ${imageUrl.substring(0,30)}`) : err);
                    };
                    htmlImg.src = imageUrl;
                });
                cacheMap.set(imageUrl, imagePromise);
            }
            
            // Create a promise that resolves to a pair of the Konva node and its loaded HTMLImageElement
            const pairedPromise = imagePromise.then(htmlImg => ({ konvaNode: konvaImgNode, htmlImg }))
                                          .catch(err => {
                                            // Ensure errors from imagePromise are propagated correctly if not already an Error object
                                            throw err instanceof Error ? err : new Error('Image loading failed in pairedPromise'); 
                                          });
            imageElementAndNodePromises.push(pairedPromise);

        } else {
            // For lines, add them directly
            tempLayer.add(new Konva.Line({
                points: path.points,
                stroke: path.strokeColor,
                strokeWidth: path.strokeWidth,
                globalCompositeOperation: path.isEraser ? 'destination-out' : 'source-over',
                tension: 0.5, // Match existing line style in main canvas
                lineCap: 'round',
                lineJoin: 'round',
            }));
        }
    }

    try {
        const loadedImagePairs = await Promise.all(imageElementAndNodePromises);
        for (const pair of loadedImagePairs) {
            pair.konvaNode.image(pair.htmlImg);
        }
    } catch (error) {
        // Error logging for individual image failures already happened in their respective promise rejections.
        // This catch block handles the case where Promise.all itself rejects (e.g., if one promise rejects).
        console.error("One or more images failed to load for smudge base construction:", error);
        tempStage.destroy();
        // document.body.removeChild(tempStageNode); // Clean up if appended
        throw new Error("Failed to load one or more images required for the smudge operation."); // Propagate a user-friendly error
    }
    
    tempLayer.draw(); // Synchronously draw the layer to its canvas.

    const dataURL = tempLayer.toDataURL(); // Get data from the layer's canvas

    tempStage.destroy(); // Clean up the temporary stage
    // document.body.removeChild(tempStageNode); // Clean up if appended
    return dataURL;
};

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
      isPaintBucketActive,
      isSmudgeActive,
    },
    ref,
  ) => {
    const fillImagePromiseCacheRef = React.useRef(new Map<string, Promise<HTMLImageElement>>());

    const canvasContainerRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const stageRef = React.useRef<Konva.Stage>(null);
    const drawingLayerRef = React.useRef<Konva.Layer>(null);
    const smudgePreviewLayerRef = React.useRef<Konva.Layer>(null);
    const smudgeAccumulatorCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const smudgeImageRef = React.useRef<Konva.Image | null>(null);
    const baseDrawingForSmudgeDataUrlRef = React.useRef<string | null>(null);
    const lastSmudgePointRef = React.useRef<{ x: number; y: number } | null>(null);
    const smudgeReadCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

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
    const [isCurrentlySmudging, setIsCurrentlySmudging] = useState(false);

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

    // Helper: Flood fill algorithm (4-way)
    // Reads from ctxRead, writes ONLY the fill to ctxWrite
    function floodFill(
      ctxRead: CanvasRenderingContext2D,
      ctxWrite: CanvasRenderingContext2D,
      x: number,
      y: number,
      fillColorRgba: [number, number, number, number],
      tolerance: number = 0,
    ) {
      const width = ctxRead.canvas.width;
      const height = ctxRead.canvas.height;

      const imageDataRead = ctxRead.getImageData(0, 0, width, height);
      const dataRead = imageDataRead.data;

      // Create imageData for writing, initially all transparent
      const imageDataWrite = ctxWrite.createImageData(width, height);
      const dataWrite = imageDataWrite.data; // This is a view, changes will reflect in imageDataWrite

      const stack = [[x, y]];
      const pixelPos = (px: number, py: number) => (py * width + px) * 4;

      const startReadIdx = pixelPos(x, y);
      const sr = dataRead[startReadIdx];
      const sg = dataRead[startReadIdx + 1];
      const sb = dataRead[startReadIdx + 2];
      const sa = dataRead[startReadIdx + 3];

      // console.log(`Flood fill starting color (RGBA): ${sr}, ${sg}, ${sb}, ${sa}`); // REMOVE this debug log

      if (
        sr === fillColorRgba[0] &&
        sg === fillColorRgba[1] &&
        sb === fillColorRgba[2] &&
        sa === fillColorRgba[3]
      ) {
        return; // Clicked on a pixel already matching the fill color
      }

      if (sa === 0 && fillColorRgba[3] === 0) {
        return; // Trying to fill transparent with transparent
      }

      const visited = new Set<string>(); // To avoid re-processing pixels

      while (stack.length > 0) {
        const [cx, cy] = stack.pop()!;
        const currentPixelKey = `${cx},${cy}`;

        if (cx < 0 || cy < 0 || cx >= width || cy >= height || visited.has(currentPixelKey)) {
          continue;
        }
        visited.add(currentPixelKey);

        const readIdx = pixelPos(cx, cy);
        const r = dataRead[readIdx];
        const g = dataRead[readIdx + 1];
        const b = dataRead[readIdx + 2];
        const a = dataRead[readIdx + 3];

        // Check with tolerance for RGB, exact match for Alpha
        if (
          Math.abs(r - sr) <= tolerance &&
          Math.abs(g - sg) <= tolerance &&
          Math.abs(b - sb) <= tolerance &&
          a === sa // Exact match for alpha of the start pixel
        ) {
          // Set pixel on the write canvas to fillColorRgba
          dataWrite[readIdx]     = fillColorRgba[0];
          dataWrite[readIdx + 1] = fillColorRgba[1];
          dataWrite[readIdx + 2] = fillColorRgba[2];
          dataWrite[readIdx + 3] = fillColorRgba[3];

          stack.push([cx + 1, cy]);
          stack.push([cx - 1, cy]);
          stack.push([cx, cy + 1]);
          stack.push([cx, cy - 1]);
        }
      }
      ctxWrite.putImageData(imageDataWrite, 0, 0);
    }

    // --- SMUDGE LOGIC --- 
    const performSmudgeStep = (x: number, y: number, isContinuingStroke: boolean) => {
      if (!smudgeAccumulatorCanvasRef.current || !smudgeReadCanvasRef.current) {
        console.error('[SketchCanvas] performSmudgeStep: Missing accumulator or read canvas for smudge.');
        return;
      }

      const accCanvas = smudgeAccumulatorCanvasRef.current;
      const accCtx = accCanvas.getContext('2d');
      const readCtx = smudgeReadCanvasRef.current.getContext('2d');

      if (!accCtx || !readCtx) {
          console.error("[SketchCanvas] performSmudgeStep: Missing a canvas context.");
          return;
      }

      const smudgeRadius = scaledStrokeWidth * 0.8;
      const smudgeStrength = 0.08;
      
      const pixelData = readCtx.getImageData(
        Math.max(0, Math.floor(x) - Math.floor(smudgeRadius)),
        Math.max(0, Math.floor(y) - Math.floor(smudgeRadius)),
        Math.floor(smudgeRadius) * 2,
        Math.floor(smudgeRadius) * 2
      ).data;

      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3] > 10) { 
          r += pixelData[i];
          g += pixelData[i + 1];
          b += pixelData[i + 2];
          count++;
        }
      }

      if (count > 0) {
        const avgR = Math.floor(r / count);
        const avgG = Math.floor(g / count);
        const avgB = Math.floor(b / count);
        const color = `rgba(${avgR},${avgG},${avgB},${smudgeStrength})`;

        accCtx.lineCap = 'round';
        accCtx.lineJoin = 'round';
        accCtx.strokeStyle = color;
        accCtx.lineWidth = smudgeRadius * 2;

        accCtx.beginPath();
        if (isContinuingStroke && lastSmudgePointRef.current) {
          accCtx.moveTo(lastSmudgePointRef.current.x, lastSmudgePointRef.current.y);
        } else {
          accCtx.moveTo(x, y); 
        }
        accCtx.lineTo(x, y);
        accCtx.stroke();
        
        lastSmudgePointRef.current = { x, y };

        if (smudgeImageRef.current) {
          smudgeImageRef.current.image(accCanvas);
        }
        smudgePreviewLayerRef.current?.batchDraw();
      }
    };

    useImperativeHandle(ref, () => ({
      stageRef,
      fileInputRef,
      canvasContainerRef,
      canvasRef: compatCanvasRef,
      clearCanvas: () => {
        setDrawnPaths([]);
        setRedoStack([]);
      },
      exportPaths: () => drawnPaths,
      exportImage: (mimeType: string) => stageRef.current?.toDataURL({ mimeType }) || '',
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
      fillAt: (x: number, y: number, color: string) => {
        console.log('[SketchCanvas] fillAt called', { x, y, color });
        if (!drawingLayerRef.current) return;

        const dataUrlDrawingLayer = drawingLayerRef.current.toDataURL();

        const tempCanvasRead = document.createElement('canvas');
        tempCanvasRead.width = canvasSize;
        tempCanvasRead.height = canvasSize;
        const ctxRead = tempCanvasRead.getContext('2d');

        const tempCanvasWrite = document.createElement('canvas');
        tempCanvasWrite.width = canvasSize;
        tempCanvasWrite.height = canvasSize;
        const ctxWrite = tempCanvasWrite.getContext('2d');

        if (!ctxRead || !ctxWrite) {
          console.error("Failed to get 2D context for fill operation");
          return;
        }

        const img = new window.Image();
        img.onload = () => {
          ctxRead.clearRect(0, 0, canvasSize, canvasSize);
          ctxRead.drawImage(img, 0, 0, canvasSize, canvasSize);

          ctxWrite.clearRect(0,0, canvasSize, canvasSize); // Ensure write canvas is transparent

          const hexToRgba = (hex: string): [number, number, number, number] => {
            let c = hex.replace('#', '');
            if (c.length === 3) c = c.split('').map((ch) => ch + ch).join('');
            const num = parseInt(c, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
          };
          const fillColorRgba = hexToRgba(color);
          const fillTolerance = 100; // Increased tolerance for testing

          floodFill(ctxRead, ctxWrite, Math.floor(x), Math.floor(y), fillColorRgba, fillTolerance);

          const filledAreaDataUrl = tempCanvasWrite.toDataURL();
          
          // Basic check if anything was filled. Create a blank canvas data URL for comparison.
          const blankCanvas = document.createElement('canvas');
          blankCanvas.width = canvasSize;
          blankCanvas.height = canvasSize;
          if (filledAreaDataUrl === blankCanvas.toDataURL()) {
            console.log("Fill resulted in a blank image (no change or filled transparently), not adding path.");
            return;
          }

          const filledImg = new window.Image();
          filledImg.onload = () => {
            setDrawnPaths((prev) => [
              ...prev,
              {
                points: [], 
                strokeColor: color, 
                strokeWidth: 0,   
                isEraser: false,  
                fillImageDataUrl: filledAreaDataUrl,
              },
            ]);
          };
          filledImg.src = filledAreaDataUrl;
        };
        img.onerror = () => {
            console.error("Failed to load drawing layer image for fill operation");
        }
        img.src = dataUrlDrawingLayer;
      },
    }), [canvasSize, drawnPaths, setDrawnPaths, setRedoStack, compatCanvasRef, stageRef, drawingLayerRef, fileInputRef, canvasContainerRef]);

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
      const pos = stageRef.current?.getPointerPosition();

      if (isSmudgeActive) {
        console.log(`[SketchCanvas] Smudge mode active. Raw Event Type: ${evt.type}, Konva Mapped Event: ${eventType}, Pos:`, pos);
        if (!pos) {
          console.log('[SketchCanvas] No pointer position in smudge mode.');
          return;
        }
        if (evt.type === 'mousedown' || evt.type === 'touchstart') {
          console.log('[SketchCanvas] Smudge pointer DOWN recognized.');

          // Asynchronously create the smudge base and then initialize smudge
          (async () => {
            try {
              // Capture pos and domEvent from the outer scope, ensure they are valid.
              const currentPos = stageRef.current?.getPointerPosition();
              if (!currentPos) {
                  console.error("[SketchCanvas] Smudge start: Pointer position lost.");
                  setIsCurrentlySmudging(false);
                  return;
              }
              
              console.log('[SketchCanvas] Creating smudge base data URL...');
              const smudgeBaseDataUrl = await createSmudgeBaseDataURL(drawnPaths, canvasSize, fillImagePromiseCacheRef.current);
              baseDrawingForSmudgeDataUrlRef.current = smudgeBaseDataUrl;
              console.log('[SketchCanvas] Smudge base data URL created, length:', smudgeBaseDataUrl.length);
              
              // Prepare the smudgeReadCanvasRef ONCE for this stroke
              if (!smudgeReadCanvasRef.current) {
                smudgeReadCanvasRef.current = document.createElement('canvas');
              }
              const readCanvas = smudgeReadCanvasRef.current;
              readCanvas.width = canvasSize;
              readCanvas.height = canvasSize;
              const readCtx = readCanvas.getContext('2d');

              if (!readCtx) {
                console.error("Failed to get context for smudgeReadCanvas");
                baseDrawingForSmudgeDataUrlRef.current = null; // Don't proceed if setup failed
                setIsCurrentlySmudging(false);
                return;
              }

              const baseImg = new window.Image();
              baseImg.onload = () => {
                readCtx.clearRect(0,0, readCanvas.width, readCanvas.height);
                readCtx.drawImage(baseImg, 0, 0);
                console.log('[SketchCanvas] Smudge read canvas populated.');
                
                // Now that the read canvas is ready, proceed with smudge state and first step
                lastSmudgePointRef.current = { x: currentPos.x, y: currentPos.y };
                setIsCurrentlySmudging(true);
                
                // Ensure accumulator canvas is ready and clear for a new smudge stroke
                if (!smudgeAccumulatorCanvasRef.current) {
                  smudgeAccumulatorCanvasRef.current = document.createElement('canvas');
                }
                const accCanvas = smudgeAccumulatorCanvasRef.current;
                accCanvas.width = canvasSize;
                accCanvas.height = canvasSize;
                const accCtx = accCanvas.getContext('2d');
                accCtx?.clearRect(0, 0, canvasSize, canvasSize);
                
                if (smudgePreviewLayerRef.current) {
                    if (!smudgeImageRef.current) {
                        const newSmudgeImage = new Konva.Image({ image: accCanvas, width: canvasSize, height: canvasSize, listening: false });
                        smudgePreviewLayerRef.current.destroyChildren();
                        smudgePreviewLayerRef.current.add(newSmudgeImage);
                        (smudgeImageRef as React.MutableRefObject<Konva.Image | null>).current = newSmudgeImage;
                    } else {
                        smudgeImageRef.current.image(accCanvas);
                    }
                    smudgePreviewLayerRef.current.batchDraw();
                }
                performSmudgeStep(currentPos.x, currentPos.y, false);
                onPointerDown(domEvent as any);
              };
              baseImg.onerror = () => {
                console.error("Failed to load baseDrawingForSmudgeDataUrl into smudgeReadCanvas's image");
                baseDrawingForSmudgeDataUrlRef.current = null;
                setIsCurrentlySmudging(false);
              };

              if(baseDrawingForSmudgeDataUrlRef.current){
                baseImg.src = baseDrawingForSmudgeDataUrlRef.current;
              } else {
                 // This case should ideally not be hit if createSmudgeBaseDataURL succeeded or threw
                 console.error("baseDrawingForSmudgeDataUrlRef.current is null after createSmudgeBaseDataURL (unexpected)");
                 setIsCurrentlySmudging(false);
                 return;
              }

            } catch (error) {
              console.error("Failed to initialize smudge due to error in createSmudgeBaseDataURL or subsequent setup:", error);
              setIsCurrentlySmudging(false);
              // Optionally notify user here
            }
          })(); // Self-invoking async function

        } else if (evt.type === 'mousemove' || evt.type === 'touchmove') {
          if (isCurrentlySmudging) {
            console.log('[SketchCanvas] Smudge pointer MOVE, performing step.');
            performSmudgeStep(pos.x, pos.y, true); // true: continuing stroke
          }
          onPointerMove(domEvent as any);
        } else if (evt.type === 'mouseup' || evt.type === 'touchend') {
          console.log('[SketchCanvas] Smudge pointer UP recognized. isCurrentlySmudging:', isCurrentlySmudging);
          if (isCurrentlySmudging) {
            setIsCurrentlySmudging(false);
            if (smudgeAccumulatorCanvasRef.current) {
              const smudgeStrokeDataUrl = smudgeAccumulatorCanvasRef.current.toDataURL();
              console.log('[SketchCanvas] Smudge stroke data URL length:', smudgeStrokeDataUrl.length);
              // Check if the smudge actually did anything to avoid adding blank paths
              const blankCanvas = document.createElement('canvas');
              blankCanvas.width = canvasSize;
              blankCanvas.height = canvasSize;
              if (smudgeStrokeDataUrl !== blankCanvas.toDataURL()) {
                  console.log('[SketchCanvas] Adding smudge stroke to drawnPaths.');
                  setDrawnPaths((prev) => [
                    ...prev,
                    {
                      points: [],
                      strokeColor: '#00000000', // Smudge doesn't have a single stroke color
                      strokeWidth: 0,
                      isEraser: false,
                      fillImageDataUrl: smudgeStrokeDataUrl, // Save the whole smudge stroke
                    },
                  ]);
              }
              // Clear the accumulator canvas for the next stroke, and hide preview
              const accCtx = smudgeAccumulatorCanvasRef.current.getContext('2d');
              accCtx?.clearRect(0, 0, canvasSize, canvasSize);
              if (smudgeImageRef.current) smudgeImageRef.current.image(undefined); // Use undefined to clear
              smudgePreviewLayerRef.current?.batchDraw();
            }
            baseDrawingForSmudgeDataUrlRef.current = null; // Clear the stored base image
            lastSmudgePointRef.current = null;
            // Clear the read canvas too
            const readCtx = smudgeReadCanvasRef.current?.getContext('2d');
            readCtx?.clearRect(0,0, smudgeReadCanvasRef.current?.width ?? 0, smudgeReadCanvasRef.current?.height ?? 0);
          }
          onPointerUp(domEvent as any);
        }
        return; // Smudge mode handled, skip default drawing logic
      }

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
          cursor: isSmudgeActive
            ? smudgeCursor
            : isPaintBucketActive
              ? paintBucketCursor
              : dropperMode
                ? 'crosshair'
                : isAdjustMode && tracingActive
                  ? 'move'
                  : isEraser
                    ? eraserCursor
                    : pencilCursor,
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
          {/* Smudge Preview Layer (NEW) */}
          <Layer ref={smudgePreviewLayerRef} listening={false} />
          {/* Drawing Layer */}
          <Layer ref={drawingLayerRef}>
            {drawnPaths.map((path, i) =>
              path.fillImageDataUrl ? (
                <KonvaImageFromUrl key={`fill-${i}`} src={path.fillImageDataUrl} width={canvasSize} height={canvasSize} />
              ) : (
                <KonvaLine
                  key={`line-${i}`}
                  points={path.points}
                  stroke={path.strokeColor}
                  strokeWidth={path.strokeWidth}
                  globalCompositeOperation={path.isEraser ? 'destination-out' : 'source-over'}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              )
            )}
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