import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Paper from '@/assets/placeholders/paper.png';

interface PencilSketchPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (imageBlob: string) => void;
}

// Pencil grades with opacity levels
type PencilGrade = {
  label: string;
  opacity: number;
  description: string;
};

const PENCIL_GRADES: PencilGrade[] = [
  { label: '6H', opacity: 0.1, description: 'Extra hard, very light' },
  { label: '4H', opacity: 0.15, description: 'Hard, light' },
  { label: '2H', opacity: 0.25, description: 'Medium hard' },
  { label: 'HB', opacity: 0.4, description: 'Medium, balanced' },
  { label: 'B', opacity: 0.55, description: 'Soft' },
  { label: '2B', opacity: 0.7, description: 'Softer, darker' },
  { label: '4B', opacity: 0.85, description: 'Very soft, dark' },
  { label: '6B', opacity: 1, description: 'Extra soft, darkest' },
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
];

export const PencilSketchPortal: React.FC<PencilSketchPortalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedGrade, setSelectedGrade] = useState<PencilGrade>(PENCIL_GRADES[3]); // Default to HB
  const [baseColor, setBaseColor] = useState(COLORS[0].value); // Default to Graphite
  const [customColor, setCustomColor] = useState(COLORS[0].value);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [canvasSize, setCanvasSize] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  // Adjust canvas size based on available width
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Get the available width, minus some padding
          const availableWidth = entry.contentRect.width - 40;
          // Make sure we don't make it too large
          const size = Math.min(availableWidth, 800);
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

  const handleSave = async () => {
    try {
      if (canvasRef.current) {
        const data = await canvasRef.current.exportImage('png');
        const link = document.createElement('a');
        link.href = data;
        link.download = 'my-ledger-page.png';
        link.click();
        toast({ title: "Success", description: "Your drawing has been saved!" });
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save your drawing." });
    }
  };

  const handleSubmit = async () => {
    try {
      if (canvasRef.current && onSubmit) {
        const data = await canvasRef.current.exportImage('png');
        onSubmit(data);
        toast({ title: "Success", description: "Your drawing has been submitted!" });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting drawing:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to submit your drawing." });
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setBaseColor(e.target.value);
  };

  const getCurrentColorName = () => {
    const foundColor = COLORS.find(c => c.value === baseColor);
    return foundColor ? foundColor.name : "Custom";
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div ref={containerRef} className="bg-white rounded-xl overflow-hidden w-11/12 max-w-4xl flex flex-col">
        <div className="p-3 bg-gray-100 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Sketch Your Page</h2>
        </div>
        
        <div className="flex-1 overflow-auto py-4 flex justify-center" style={{ 
          maxHeight: 'calc(90vh - 120px)',
          width: '100%'
        }}>
          <div style={{
            width: `${canvasSize}px`,
            height: `${canvasSize}px`,
            border: '1px solid black',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              width={`${canvasSize}`}
              height={`${canvasSize}`}
              backgroundImage={Paper}
              exportWithBackgroundImage={false}
              preserveBackgroundImageAspectRatio="none"
              canvasColor="transparent"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </div>
        
        <div className="p-3 bg-gray-100 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {/* Pencil Grade Selector */}
            <div>
              <label className="text-sm block mb-1">Pencil Grade: <span className="font-semibold">{selectedGrade.label}</span></label>
              <div className="flex gap-1">
                {PENCIL_GRADES.map((grade) => (
                  <button
                    key={grade.label}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2 py-1 text-xs border ${
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
            
            {/* Pencil Size Selector */}
            <div>
              <label className="text-sm block mb-1">Size: {strokeWidth}px</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-24"
              />
            </div>
            
            {/* Current Color */}
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full border-2 border-black"
                style={{ backgroundColor: baseColor }}
              />
              <div className="text-sm">
                <div>Color: <span className="font-semibold">{getCurrentColorName()}</span></div>
              </div>
            </div>
          </div>
          
          {/* Simplified Color Palette */}
          <div className="mb-3">
            <label className="text-sm block mb-1">Colors:</label>
            <div className="flex flex-wrap gap-2 items-center">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBaseColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    baseColor === color.value 
                      ? 'border-black ring-2 ring-offset-1 ring-gray-400' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <div className="flex items-center ml-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-8 h-8 cursor-pointer rounded-full"
                  title="Custom color"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUndo}
            >
              Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}; 