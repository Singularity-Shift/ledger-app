import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Paper from "@/assets/placeholders/paper.png";
import { useAbiClient } from "@/contexts/AbiProvider";
import { LedgeABI } from "@/abis";
import { COLLECTION_ADDRESS } from "@/constants";

interface PencilSketchPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (imageFile: File) => void;
}

// Pencil grades with opacity levels
type PencilGrade = {
  label: string;
  opacity: number;
  description: string;
};

const PENCIL_GRADES: PencilGrade[] = [
  { label: "9H", opacity: 0.03, description: "Hardest, faintest" },
  { label: "8H", opacity: 0.05, description: "Ultra hard, extremely light" },
  { label: "7H", opacity: 0.07, description: "Very very hard, very faint" },
  { label: "6H", opacity: 0.1, description: "Extra hard, very light" },
  { label: "5H", opacity: 0.12, description: "Very hard, light" },
  { label: "4H", opacity: 0.15, description: "Hard, light" },
  { label: "3H", opacity: 0.2, description: "Medium hard, light" },
  { label: "2H", opacity: 0.25, description: "Medium hard" },
  { label: "H", opacity: 0.3, description: "Hard" },
  { label: "F", opacity: 0.35, description: "Fine, between H and HB" },
  { label: "HB", opacity: 0.4, description: "Medium, balanced" },
  { label: "B", opacity: 0.55, description: "Soft" },
  { label: "2B", opacity: 0.65, description: "Softer, darker" },
  { label: "3B", opacity: 0.75, description: "Very soft" },
  { label: "4B", opacity: 0.8, description: "Very soft, dark" },
  { label: "5B", opacity: 0.85, description: "Extra soft" },
  { label: "6B", opacity: 0.9, description: "Extra soft, very dark" },
  { label: "7B", opacity: 0.95, description: "Ultra soft, very dark" },
  { label: "8B", opacity: 0.97, description: "Ultra soft, darkest" },
  { label: "9B", opacity: 1, description: "Softest, maximum darkness" },
];

// Predefined colors
const COLORS = [
  { name: "Graphite", value: "#333333" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#FF0000" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Blue", value: "#0000FF" },
  { name: "Orange", value: "#FFA500" },
  { name: "Green", value: "#00FF00" },
  { name: "Purple", value: "#800080" },
  { name: "Sepia", value: "#704214" },
  { name: "Teal", value: "#008080" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Violet", value: "#8F00FF" },
  { name: "Navy", value: "#000080" },
  { name: "Forest", value: "#228B22" },
  { name: "Maroon", value: "#800000" },
  { name: "Gold", value: "#FFD700" },
];

export const PencilSketchPortal: React.FC<PencilSketchPortalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedGrade, setSelectedGrade] = useState<PencilGrade>(PENCIL_GRADES[3]); // Default to HB
  const [baseColor, setBaseColor] = useState(COLORS[0].value); // Default to Graphite
  const [customColor, setCustomColor] = useState(COLORS[0].value);
  const [isEraser, setIsEraser] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [elapsedTime, setElapsedTime] = useState(0);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(1000);
  const containerRef = useRef<HTMLDivElement>(null);
  const { abi } = useAbiClient();

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

          // Calculate available space for canvas (accounting for controls)
          const controlsHeight = 300; // Approximate height of controls
          const availableHeight = Math.max(containerHeight - controlsHeight, 300);
          const availableWidth = Math.max(containerWidth - 40, 300); // 40px for padding

          // Calculate the reduction factor based on screen size
          // Use less reduction for mobile (smaller screens)
          const isMobile = containerWidth < 768; // Standard mobile breakpoint
          const reductionFactor = isMobile ? 0.98 : 0.9;

          // Use the smaller of width or height to maintain square aspect ratio
          const size = Math.min(availableWidth, availableHeight, 1000) * reductionFactor;
          setCanvasSize(size);
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isOpen]);

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  const handleSubmit = async () => {
    try {
      if (canvasRef.current && onSubmit) {
        const data = await canvasRef.current.exportImage("png");
        const response = await fetch(data);

        const blob = await response.blob();

        const idResult = await abi?.useABI(LedgeABI).view.get_nft_minted({
          typeArguments: [],
          functionArguments: [COLLECTION_ADDRESS],
        });

        const id = parseInt(idResult?.[0] || "1");

        const file = new File([blob], `${id + 1}.png`, { type: "image/png" });

        onSubmit(file);
        toast({ title: "Success", description: "Your drawing has been submitted!" });
        onClose();
      }
    } catch (error) {
      console.error("Error submitting drawing:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to submit your drawing." });
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setBaseColor(e.target.value);
  };

  const getCurrentColorName = () => {
    const foundColor = COLORS.find((c) => c.value === baseColor);
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

  // Simple counter from when portal opens
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      setElapsedTime(0); // Reset timer when portal opens
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen]);

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
    if (isEraser) {
      setIsErasing(true);
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEraser && isErasing) {
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handlePointerUp = () => {
    setIsErasing(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div ref={containerRef} className="bg-white rounded-xl overflow-hidden w-11/12 max-w-4xl flex flex-col h-[90vh]">
        <div className="p-2 bg-gray-100 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Sketch Your Page</h2>
        </div>

        <div className="flex-1 p-4 flex justify-center items-center overflow-hidden bg-gray-50">
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm">
            <div
              ref={canvasContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{
                width: `${canvasSize}px`,
                height: `${canvasSize}px`,
                border: "2px solid black",
                borderRadius: "4px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={scaledStrokeWidth}
                strokeColor={strokeColor}
                width={`${canvasSize}`}
                height={`${canvasSize}`}
                backgroundImage={Paper}
                exportWithBackgroundImage={false}
                preserveBackgroundImageAspectRatio="none"
                canvasColor="transparent"
                eraserWidth={scaledStrokeWidth}
                allowOnlyPointerType="all"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
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
            </div>
          </div>
        </div>

        <div className="p-2 bg-gray-100 border-t border-gray-200">
          <div className="max-w-[500px] mx-auto space-y-2">
            {/* Top Row - Mode and Time */}
            <div className="grid grid-cols-2 gap-2">
              {/* Draw/Erase Toggle */}
              <div>
                <label className="text-xs font-medium mb-1 block">Mode:</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsEraser(false)}
                    className={`flex-1 px-2 py-1 text-sm border rounded-l ${
                      !isEraser ? "bg-gray-800 text-white" : "bg-white"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    ✏️ Draw
                  </button>
                  <button
                    onClick={() => setIsEraser(true)}
                    className={`flex-1 px-2 py-1 text-sm border rounded-r ${
                      isEraser ? "bg-gray-800 text-white" : "bg-white"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    ⚪ Erase
                  </button>
                </div>
              </div>

              {/* Drawing Time Display */}
              <div>
                <label className="text-xs font-medium mb-1 block">Time:</label>
                <div className="px-3 py-1 text-sm border rounded bg-white text-center font-medium">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>

            {/* Middle Row - Color and Size */}
            <div className="grid grid-cols-2 gap-2">
              {/* Selected Color Display */}
              <div>
                <label className="text-xs font-medium mb-1 block">Selected Color:</label>
                <div className="flex items-center gap-2 px-3 py-1 border rounded bg-white">
                  <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: baseColor }} />
                  <span className="text-sm">{getCurrentColorName()}</span>
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
                  className="w-full"
                />
              </div>
            </div>

            {/* Pencil Grade Selector */}
            <div>
              <label className="text-xs font-medium mb-1 block">Pencil Grade:</label>
              <div className="flex flex-wrap gap-1">
                {PENCIL_GRADES.map((grade) => (
                  <button
                    key={grade.label}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2 py-0.5 text-xs border rounded ${
                      selectedGrade.label === grade.label ? "bg-gray-800 text-white" : "bg-white"
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
              <div className="grid grid-cols-9 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBaseColor(color.value)}
                    className={`w-6 h-6 rounded-full border ${
                      baseColor === color.value ? "border-black ring-1 ring-offset-1 ring-gray-400" : "border-gray-300"
                    } transition-all duration-150 hover:scale-110`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <div className="relative w-6 h-6">
                  <button
                    className={`w-6 h-6 rounded-full border ${
                      !COLORS.find((c) => c.value === baseColor)
                        ? "border-black ring-1 ring-offset-1 ring-gray-400"
                        : "border-gray-300"
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
            <div className="flex justify-end gap-1">
              <Button variant="outline" size="sm" onClick={handleUndo} className="min-w-[60px]">
                Undo
              </Button>
              <Button variant="outline" size="sm" onClick={handleRedo} className="min-w-[60px]">
                Redo
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear} className="min-w-[60px]">
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={handleSubmit} className="min-w-[60px]">
                Submit
              </Button>
              <Button variant="default" size="sm" onClick={onClose} className="min-w-[60px]">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
