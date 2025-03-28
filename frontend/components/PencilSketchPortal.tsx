import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Paper from '@/assets/placeholders/paper.png';

// Google Fonts
const GOOGLE_FONTS = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 
  'Source Sans Pro', 'Slabo 27px', 'Raleway', 'PT Sans', 'Roboto Condensed',
  'Merriweather', 'Ubuntu', 'Roboto Slab', 'Playfair Display', 'Lora',
  'PT Serif', 'Nunito', 'Titillium Web', 'Rubik', 'Fira Sans',
  'Noto Sans', 'Crimson Text', 'Work Sans', 'Quicksand', 'Karla'
];

interface PencilSketchPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (imageBlob: string, drawingTime: number) => void;
}

// Text Element interface
interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fontSize: number;
  fontFamily: string;
  isDragging: boolean;
  isResizing: boolean;
  isHovered: boolean;
  isSelected: boolean;
  resizeHandle: ResizeHandle | null;
  touchStartTime?: number;
}

type ResizeHandle = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

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
  
  // Text tool states
  const [isTextMode, setIsTextMode] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textSize, setTextSize] = useState(24);
  const [selectedFont, setSelectedFont] = useState('Roboto');
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  
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
          const controlsHeight = 300; // Approximate height of controls
          const availableHeight = Math.max(containerHeight - controlsHeight, 300);
          const availableWidth = Math.max(containerWidth - 40, 300); // 40px for padding
          
          // Calculate the reduction factor based on screen size
          // Use less reduction for mobile (smaller screens)
          const isMobile = containerWidth < 768; // Standard mobile breakpoint
          const reductionFactor = isMobile ? 0.98 : 0.90;
          
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
    setTextElements([]);
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  const handleSave = async () => {
    try {
      if (canvasRef.current) {
        // Get the canvas data
        const data = await canvasRef.current.exportImage('png');
        
        // If there are any text elements, we need to render them onto the image
        if (textElements.length > 0) {
          // Create a temp canvas to draw everything
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          const img = new Image();
          
          // Set up promise to handle async loading
          const renderResult = new Promise<string>((resolve, reject) => {
            if (!tempCtx) {
              reject('Failed to get canvas context');
              return;
            }
            
            img.onload = () => {
              // Set canvas size
              tempCanvas.width = img.width;
              tempCanvas.height = img.height;
              
              // Draw the sketch
              tempCtx.drawImage(img, 0, 0);
              
              // Calculate scale factor based on original canvas size vs export size
              const scaleFactor = img.width / canvasSize;
              
              // Draw all text elements
              textElements.forEach(element => {
                // Set text properties
                tempCtx.font = `${element.fontSize * scaleFactor}px "${element.fontFamily}", sans-serif`;
                tempCtx.fillStyle = element.color;
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                
                // Draw text at scaled position
                tempCtx.fillText(
                  element.text, 
                  element.x * scaleFactor, 
                  element.y * scaleFactor
                );
              });
              
              // Get the combined image data
              const combinedImageData = tempCanvas.toDataURL('image/png');
              resolve(combinedImageData);
            };
            
            img.onerror = () => {
              reject('Failed to load image');
            };
            
            // Load the sketch image
            img.src = data;
          });
          
          // Wait for rendering to complete and download
          const finalImageData = await renderResult;
          
          const link = document.createElement('a');
          link.href = finalImageData;
          link.download = 'my-ledger-page.png';
          link.click();
          toast({ title: "Success", description: "Your drawing has been saved!" });
        } else {
          // If no text, just save the original canvas data
          const link = document.createElement('a');
          link.href = data;
          link.download = 'my-ledger-page.png';
          link.click();
          toast({ title: "Success", description: "Your drawing has been saved!" });
        }
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save your drawing." });
    }
  };

  const handleSubmit = async () => {
    try {
      if (canvasRef.current && onSubmit) {
        // Get the canvas data
        const data = await canvasRef.current.exportImage('png');
        
        // If there are any text elements, we need to render them onto the image
        if (textElements.length > 0) {
          // Create a temp canvas to draw everything
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          const img = new Image();
          
          // Set up promise to handle async loading
          const renderResult = new Promise<string>((resolve, reject) => {
            if (!tempCtx) {
              reject('Failed to get canvas context');
              return;
            }
            
            img.onload = () => {
              // Set canvas size
              tempCanvas.width = img.width;
              tempCanvas.height = img.height;
              
              // Draw the sketch
              tempCtx.drawImage(img, 0, 0);
              
              // Calculate scale factor based on original canvas size vs export size
              const scaleFactor = img.width / canvasSize;
              
              // Draw all text elements
              textElements.forEach(element => {
                // Set text properties
                tempCtx.font = `${element.fontSize * scaleFactor}px "${element.fontFamily}", sans-serif`;
                tempCtx.fillStyle = element.color;
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                
                // Draw text at scaled position
                tempCtx.fillText(
                  element.text, 
                  element.x * scaleFactor, 
                  element.y * scaleFactor
                );
              });
              
              // Get the combined image data
              const combinedImageData = tempCanvas.toDataURL('image/png');
              resolve(combinedImageData);
            };
            
            img.onerror = () => {
              reject('Failed to load image');
            };
            
            // Load the sketch image
            img.src = data;
          });
          
          // Wait for rendering to complete and submit
          const finalImageData = await renderResult;
          onSubmit(finalImageData, elapsedTime);
        } else {
          // If no text, just submit the original canvas data
          onSubmit(data, elapsedTime);
        }
        
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

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) {
      return `${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };
  
  // Helper to measure text dimensions consistently
  const measureTextDimensions = (
    text: string, 
    fontFamily: string, 
    fontSize: number, 
    maxWidth?: number
  ): { width: number, height: number } => {
    const padding = 10; // Padding for the text box
    
    // Create a temporary span to measure text
    const tempSpan = document.createElement('span');
    tempSpan.style.fontFamily = `"${fontFamily}", sans-serif`;
    tempSpan.style.fontSize = `${fontSize}px`;
    tempSpan.style.position = 'absolute';
    tempSpan.style.left = '-9999px';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'pre-wrap';
    tempSpan.style.display = 'inline-block';
    tempSpan.style.textAlign = 'center';
    tempSpan.style.padding = '4px';
    tempSpan.style.lineHeight = '1.2';
    
    // Set width constraint if provided
    if (maxWidth) {
      tempSpan.style.width = `${maxWidth - (padding * 2)}px`;
    }
    
    tempSpan.textContent = text;
    document.body.appendChild(tempSpan);
    
    // Get dimensions with padding
    const width = tempSpan.offsetWidth + (padding * 2);
    const height = tempSpan.offsetHeight + (padding * 2);
    
    document.body.removeChild(tempSpan);
    
    return { width, height };
  };
  
  // Text Tool Functions
  const addTextElement = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTextMode || !textInput.trim()) return;
    
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate text dimensions using helper
    const { width, height } = measureTextDimensions(
      textInput,
      selectedFont,
      textSize
    );
    
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      text: textInput,
      x,
      y,
      width,
      height,
      color: textColor,
      fontSize: textSize,
      fontFamily: selectedFont,
      isDragging: false,
      isResizing: false,
      isHovered: false,
      isSelected: false,
      resizeHandle: null
    };
    
    setTextElements(prev => [...prev, newText]);
    setTextInput(''); // Reset text input
    setIsTextMode(false); // Exit text mode after placing
  };
  
  const startDraggingText = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTextId(id);
    
    setTextElements(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isDragging: true, isResizing: false, resizeHandle: null }
          : item
      )
    );
  };
  
  const startResizingText = (id: string, handle: ResizeHandle, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTextId(id);
    
    setTextElements(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isDragging: false, isResizing: true, resizeHandle: handle }
          : item
      )
    );
  };
  
  const stopDraggingText = () => {
    setTextElements(prev => 
      prev.map(item => 
        (item.isDragging || item.isResizing)
          ? { ...item, isDragging: false, isResizing: false, resizeHandle: null }
          : item
      )
    );
    setActiveTextId(null);
  };
  
  const moveText = (e: React.MouseEvent) => {
    if (!activeTextId) return;
    
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTextElements(prev => 
      prev.map(item => {
        if (item.id !== activeTextId) return item;
        
        if (item.isDragging) {
          // Just move without resizing
          return { ...item, x, y };
        } else if (item.isResizing && item.resizeHandle) {
          // Resize based on the handle being dragged
          const newSize = { ...item };
          
          // Get original dimensions
          const origWidth = item.width;
          const origHeight = item.height;
          const origX = item.x;
          const origY = item.y;
          
          // Calculate font scale to maintain aspect ratio when resizing corners
          const aspectRatio = origWidth / origHeight;
          
          switch (item.resizeHandle) {
            case 'right':
              newSize.width = Math.max(20, x - (origX - origWidth / 2));
              break;
            case 'left':
              const newRightEdge = origX + origWidth / 2;
              newSize.width = Math.max(20, newRightEdge - x);
              newSize.x = newRightEdge - newSize.width / 2;
              break;
            case 'bottom':
              newSize.height = Math.max(20, y - (origY - origHeight / 2));
              break;
            case 'top':
              const newBottomEdge = origY + origHeight / 2;
              newSize.height = Math.max(20, newBottomEdge - y);
              newSize.y = newBottomEdge - newSize.height / 2;
              break;
            case 'bottom-right':
              newSize.width = Math.max(20, x - (origX - origWidth / 2));
              newSize.height = Math.max(20, y - (origY - origHeight / 2));
              break;
            case 'bottom-left':
              const newBottomRightX = origX + origWidth / 2;
              newSize.width = Math.max(20, newBottomRightX - x);
              newSize.x = newBottomRightX - newSize.width / 2;
              newSize.height = Math.max(20, y - (origY - origHeight / 2));
              break;
            case 'top-right':
              newSize.width = Math.max(20, x - (origX - origWidth / 2));
              const newBottomEdgeTopRight = origY + origHeight / 2;
              newSize.height = Math.max(20, newBottomEdgeTopRight - y);
              newSize.y = newBottomEdgeTopRight - newSize.height / 2;
              break;
            case 'top-left':
              const newTopRightX = origX + origWidth / 2;
              const newBottomEdgeTopLeft = origY + origHeight / 2;
              newSize.width = Math.max(20, newTopRightX - x);
              newSize.x = newTopRightX - newSize.width / 2;
              newSize.height = Math.max(20, newBottomEdgeTopLeft - y);
              newSize.y = newBottomEdgeTopLeft - newSize.height / 2;
              break;
          }
          
          // Calculate new font size and round to nearest 0.5 for better display
          const rawFontSize = item.fontSize * scaleFactor;
          newSize.fontSize = Math.max(10, Math.round(rawFontSize * 2) / 2);
          
          // Automatic height adjustment based on content
          if (item.resizeHandle === 'left' || item.resizeHandle === 'right' ||
              item.resizeHandle.includes('top') || item.resizeHandle.includes('bottom')) {
            // Measure text with the new width constraint
            const { height: textHeight } = measureTextDimensions(
              newSize.text,
              newSize.fontFamily,
              newSize.fontSize,
              newSize.width
            );
            
            // For width-only adjustments, set the height directly
            if (item.resizeHandle === 'left' || item.resizeHandle === 'right') {
              newSize.height = textHeight;
            } 
            // For height adjustments, ensure we don't go below the minimum height needed
            else {
              newSize.height = Math.max(newSize.height, textHeight);
            }
          }
          
          return newSize;
        }
        
        return item;
      })
    );
  };
  
  const deleteTextElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTextElements(prev => prev.filter(item => item.id !== id));
  };
  
  const handleTextHoverEnter = (id: string) => {
    setTextElements(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isHovered: true }
          : item
      )
    );
  };
  
  const handleTextHoverLeave = (id: string) => {
    setTextElements(prev => 
      prev.map(item => 
        item.id === id && !item.isDragging && !item.isResizing && !item.isSelected
          ? { ...item, isHovered: false }
          : item
      )
    );
  };
  
  // Handle text selection
  const selectTextElement = (id: string) => {
    setActiveTextId(id);
    
    setTextElements(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isSelected: true }
          : { ...item, isSelected: false }
      )
    );
  };
  
  // Handle double click/tap on text element
  const handleTextDoubleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectTextElement(id);
  };
  
  // Handle touch start for long press detection
  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    // Prevent default to avoid scroll/zoom on mobile
    if (e.touches.length === 1) {
      e.preventDefault();
    }
    
    // Record touch start time for long press detection
    setTextElements(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, touchStartTime: Date.now() }
          : item
      )
    );
  };
  
  // Handle touch end to detect long press
  const handleTouchEnd = (id: string, e: React.TouchEvent) => {
    e.preventDefault();
    
    // Find the element
    const element = textElements.find(item => item.id === id);
    if (!element || !element.touchStartTime) return;
    
    // Check if this was a long press (more than 500ms)
    const touchDuration = Date.now() - element.touchStartTime;
    
    if (touchDuration > 500) {
      // Long press detected
      selectTextElement(id);
    } else {
      // Short tap - start dragging if already selected
      if (element.isSelected) {
        startDraggingText(id, e as unknown as React.MouseEvent);
      }
    }
    
    // Clear touch start time
    setTextElements(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, touchStartTime: undefined }
          : item
      )
    );
  };
  
  // Handle touch move to allow for dragging and resizing
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!activeTextId) return;
    
    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    
    // Use the same moveText logic but with touch coordinates
    setTextElements(prev => 
      prev.map(item => {
        if (item.id !== activeTextId) return item;
        
        if (item.isDragging) {
          return { ...item, x, y };
        } else if (item.isResizing && item.resizeHandle) {
          // Use the same resize logic as in moveText
          const newSize = { ...item };
          
          // Get original dimensions
          const origWidth = item.width;
          const origHeight = item.height;
          const origX = item.x;
          const origY = item.y;
          
          switch (item.resizeHandle) {
            case 'right':
              newSize.width = Math.max(20, x - (origX - origWidth / 2));
              break;
            case 'left':
              const newRightEdge = origX + origWidth / 2;
              newSize.width = Math.max(20, newRightEdge - x);
              newSize.x = newRightEdge - newSize.width / 2;
              break;
            case 'bottom':
              newSize.height = Math.max(20, y - (origY - origHeight / 2));
              break;
            case 'top':
              const newBottomEdge = origY + origHeight / 2;
              newSize.height = Math.max(20, newBottomEdge - y);
              newSize.y = newBottomEdge - newSize.height / 2;
              break;
            case 'bottom-right':
              newSize.width = Math.max(20, x - (origX - origWidth / 2));
              newSize.height = Math.max(20, y - (origY - origHeight / 2));
              break;
            case 'bottom-left':
              const newBottomRightX = origX + origWidth / 2;
              newSize.width = Math.max(20, newBottomRightX - x);
              newSize.x = newBottomRightX - newSize.width / 2;
              newSize.height = Math.max(20, y - (origY - origHeight / 2));
              break;
            case 'top-right':
              newSize.width = Math.max(20, x - (origX - origWidth / 2));
              const newBottomEdgeTopRight = origY + origHeight / 2;
              newSize.height = Math.max(20, newBottomEdgeTopRight - y);
              newSize.y = newBottomEdgeTopRight - newSize.height / 2;
              break;
            case 'top-left':
              const newTopRightX = origX + origWidth / 2;
              const newBottomEdgeTopLeft = origY + origHeight / 2;
              newSize.width = Math.max(20, newTopRightX - x);
              newSize.x = newTopRightX - newSize.width / 2;
              newSize.height = Math.max(20, newBottomEdgeTopLeft - y);
              newSize.y = newBottomEdgeTopLeft - newSize.height / 2;
              break;
          }
          
          // Calculate font size proportionally to the change in width
          const scaleFactorWidth = newSize.width / origWidth;
          const scaleFactorHeight = newSize.height / origHeight;
          
          // Use the average scale for diagonal resizing 
          // or the appropriate dimension for edge resizing
          const scaleFactor = item.resizeHandle.includes('-') 
            ? (scaleFactorWidth + scaleFactorHeight) / 2
            : (item.resizeHandle === 'left' || item.resizeHandle === 'right') 
              ? scaleFactorWidth 
              : scaleFactorHeight;
              
          // Calculate new font size and round to nearest 0.5 for better display
          const rawFontSize = item.fontSize * scaleFactor;
          newSize.fontSize = Math.max(10, Math.round(rawFontSize * 2) / 2);
          
          // Automatic height adjustment based on content
          if (item.resizeHandle === 'left' || item.resizeHandle === 'right' ||
              item.resizeHandle.includes('top') || item.resizeHandle.includes('bottom')) {
            // Measure text with the new width constraint
            const { height: textHeight } = measureTextDimensions(
              newSize.text,
              newSize.fontFamily,
              newSize.fontSize,
              newSize.width
            );
            
            // For width-only adjustments, set the height directly
            if (item.resizeHandle === 'left' || item.resizeHandle === 'right') {
              newSize.height = textHeight;
            } 
            // For height adjustments, ensure we don't go below the minimum height needed
            else {
              newSize.height = Math.max(newSize.height, textHeight);
            }
          }
          
          return newSize;
        }
        
        return item;
      })
    );
  };
  
  // Function to clear selection when clicking outside
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only call addTextElement if we're in text mode
    if (isTextMode) {
      addTextElement(e);
    } else {
      // Clear selection when clicking outside text elements
      setActiveTextId(null);
      setTextElements(prev => 
        prev.map(item => ({ 
          ...item, 
          isSelected: false, 
          isHovered: false 
        }))
      );
    }
  };

  // Simple counter from when portal opens
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      setElapsedTime(0); // Reset timer when portal opens
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen]);

  // Load Google Fonts
  useEffect(() => {
    if (!isOpen) return;
    
    // Create a link element for the fonts
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(font => `family=${font.replace(' ', '+')}`).join('&')}&display=swap`;
    link.rel = 'stylesheet';
    
    // Add to head
    document.head.appendChild(link);
    
    // Cleanup
    return () => {
      document.head.removeChild(link);
      // Reset all text element states when the portal closes
      setTextElements(prev => 
        prev.map(item => ({
          ...item,
          isDragging: false,
          isResizing: false,
          isHovered: false,
          resizeHandle: null
        }))
      );
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
          y: e.clientY - rect.top
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
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handlePointerUp = () => {
    setIsErasing(false);
  };

  const pencilCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'%3E%3C/path%3E%3C/svg%3E") 0 24, auto`;

  const eraserCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.48 3.52a3.2 3.2 0 0 0-4.53 0L3.52 15.95a3.2 3.2 0 0 0 0 4.53l4.53-4.53 8.47-8.47 4.53-4.53a3.2 3.2 0 0 0 0-4.53z'%3E%3C/path%3E%3C/svg%3E") 0 24, auto`;

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
    >
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
              onClick={handleCanvasClick}
              onMouseMove={moveText}
              onMouseUp={stopDraggingText}
              onTouchMove={handleTouchMove}
              style={{
                width: `${canvasSize}px`,
                height: `${canvasSize}px`,
                border: '2px solid black',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
                cursor: isTextMode ? 'text' : (isEraser ? eraserCursor : pencilCursor)
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
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: isTextMode ? 'none' : 'auto'
                }}
              />
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
              
              {/* Text Elements */}
              {textElements.map((textElement) => (
                <div
                  key={textElement.id}
                  className="absolute select-none"
                  style={{
                    left: textElement.x,
                    top: textElement.y,
                    transform: 'translate(-50%, -50%)',
                    width: `${textElement.width}px`,
                    height: `${textElement.height}px`,
                    userSelect: 'none',
                    position: 'absolute',
                    boxSizing: 'border-box',
                    borderRadius: '2px',
                    backgroundColor: (textElement.isSelected || textElement.isHovered) ? 'rgba(220,220,255,0.2)' : 'transparent',
                    border: (textElement.isSelected || textElement.isHovered) ? '1px dashed blue' : 'none',
                    zIndex: 200,
                    cursor: textElement.isDragging ? 'move' : 'default',
                    overflow: 'hidden'
                  }}
                  onMouseDown={(e) => startDraggingText(textElement.id, e)}
                  onMouseEnter={() => handleTextHoverEnter(textElement.id)}
                  onMouseLeave={() => handleTextHoverLeave(textElement.id)}
                  onDoubleClick={(e) => handleTextDoubleClick(textElement.id, e)}
                  onTouchStart={(e) => handleTouchStart(textElement.id, e)}
                  onTouchEnd={(e) => handleTouchEnd(textElement.id, e)}
                  onTouchMove={handleTouchMove}
                >
                  <div 
                    style={{
                      color: textElement.color,
                      fontSize: `${textElement.fontSize}px`,
                      fontFamily: `"${textElement.fontFamily}", sans-serif`,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      lineHeight: '1.2',
                      padding: '4px',
                      boxSizing: 'border-box',
                      textShadow: (textElement.isSelected || textElement.isHovered) ? '0 0 5px rgba(0,0,255,0.2)' : 'none',
                    }}
                  >
                    {textElement.text}
                  </div>

                  {/* Resize handles - show for active or hovered element */}
                  {(textElement.isSelected || textElement.isHovered) && (
                    <>
                      {/* Corner resize handles */}
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize -top-1.5 -left-1.5 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'top-left', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'top-left', e as unknown as React.MouseEvent);
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize -top-1.5 -right-1.5 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'top-right', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'top-right', e as unknown as React.MouseEvent);
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize -bottom-1.5 -left-1.5 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'bottom-left', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'bottom-left', e as unknown as React.MouseEvent);
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize -bottom-1.5 -right-1.5 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'bottom-right', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'bottom-right', e as unknown as React.MouseEvent);
                        }}
                      />

                      {/* Edge resize handles */}
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize -top-1.5 left-1/2 -translate-x-1/2 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'top', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'top', e as unknown as React.MouseEvent);
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize top-1/2 -right-1.5 -translate-y-1/2 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'right', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'right', e as unknown as React.MouseEvent);
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize -bottom-1.5 left-1/2 -translate-x-1/2 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'bottom', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'bottom', e as unknown as React.MouseEvent);
                        }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize top-1/2 -left-1.5 -translate-y-1/2 border border-white"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'left', e);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          startResizingText(textElement.id, 'left', e as unknown as React.MouseEvent);
                        }}
                      />

                      {/* Delete button */}
                      <button
                        className="absolute -top-6 -right-6 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                        onClick={(e) => deleteTextElement(textElement.id, e)}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteTextElement(textElement.id, e as unknown as React.MouseEvent);
                        }}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-2 bg-gray-100 border-t border-gray-200">
          <div className="max-w-[500px] mx-auto space-y-2">
            {/* Top Row - Mode and Time */}
            <div className="grid grid-cols-3 gap-2">
              {/* Draw/Erase/Text Toggle */}
              <div className="col-span-2">
                <label className="text-xs font-medium mb-1 block">Mode:</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setIsEraser(false);
                      setIsTextMode(false);
                    }}
                    className={`flex-1 px-2 py-1 text-sm border rounded-l ${
                      !isEraser && !isTextMode
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    ✏️ Draw
                  </button>
                  <button
                    onClick={() => {
                      setIsEraser(true);
                      setIsTextMode(false);
                    }}
                    className={`flex-1 px-2 py-1 text-sm border ${
                      isEraser 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    ⚪ Erase
                  </button>
                  <button
                    onClick={() => {
                      setIsEraser(false);
                      setIsTextMode(true);
                    }}
                    className={`flex-1 px-2 py-1 text-sm border rounded-r ${
                      isTextMode 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    🔤 Text
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

            {/* Text Controls - Show only in text mode */}
            {isTextMode && (
              <div className="p-2 border rounded bg-white">
                <div className="grid grid-cols-1 gap-2">
                  {/* Text Input */}
                  <div>
                    <label className="text-xs font-medium mb-1 block">Text:</label>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text..."
                      className="w-full px-3 py-1 border rounded text-sm"
                    />
                  </div>
                  
                  {/* Text Properties - Font family, size, color */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Font Family */}
                    <div>
                      <label className="text-xs font-medium mb-1 block">Font:</label>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        {GOOGLE_FONTS.map((font) => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Font Size */}
                    <div>
                      <label className="text-xs font-medium mb-1 block">Size: {textSize}px</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Text Color */}
                    <div>
                      <label className="text-xs font-medium mb-1 block">Color:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 p-0 border rounded"
                        />
                        <span className="text-xs overflow-hidden text-ellipsis">{textColor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    Click on canvas to place text. Click to select, double-tap or long press on mobile. Use handles to resize.
                  </div>
                </div>
              </div>
            )}

            {/* Middle Row - Color and Size - Show only in drawing mode */}
            {(!isTextMode) && (
              <div className="grid grid-cols-2 gap-2">
                {/* Selected Color Display */}
                <div>
                  <label className="text-xs font-medium mb-1 block">Selected Color:</label>
                  <div className="flex items-center gap-2 px-3 py-1 border rounded bg-white">
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: baseColor }}
                    />
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
            )}

            {/* Pencil Grade Selector - Show only in drawing mode */}
            {(!isTextMode && !isEraser) && (
              <div>
                <label className="text-xs font-medium mb-1 block">Pencil Grade:</label>
                <div className="flex flex-wrap gap-1">
                  {PENCIL_GRADES.map((grade) => (
                    <button
                      key={grade.label}
                      onClick={() => setSelectedGrade(grade)}
                      className={`px-2 py-0.5 text-xs border rounded ${
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
            )}
            
            {/* Color Palette - Show only in drawing mode */}
            {(!isTextMode && !isEraser) && (
              <div>
                <label className="text-xs font-medium mb-1 block">Color Palette:</label>
                <div className="grid grid-cols-9 gap-1">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBaseColor(color.value)}
                      className={`w-6 h-6 rounded-full border ${
                        baseColor === color.value 
                          ? 'border-black ring-1 ring-offset-1 ring-gray-400' 
                          : 'border-gray-300'
                      } transition-all duration-150 hover:scale-110`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                  <div className="relative w-6 h-6">
                    <button
                      className={`w-6 h-6 rounded-full border ${
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
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUndo}
                className="min-w-[60px]"
              >
                Undo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRedo}
                className="min-w-[60px]"
              >
                Redo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClear}
                className="min-w-[60px]"
              >
                Clear
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSubmit}
                className="min-w-[60px]"
              >
                Submit
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={onClose}
                className="min-w-[60px]"
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
