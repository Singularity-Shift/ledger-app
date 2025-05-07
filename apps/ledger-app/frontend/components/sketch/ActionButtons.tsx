import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
  handleSubmit: () => void;
  handleAuto: () => void;
  onClose: () => void;
  disabled?: boolean;
  pixelCount?: number;
  requiredPixels?: number;
  autoDisabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleUndo,
  handleRedo,
  handleClear,
  handleSubmit,
  handleAuto,
  onClose,
  disabled = false,
  pixelCount = 0,
  requiredPixels = 0,
  autoDisabled = false,
}) => {
  const validationTooltip = disabled && requiredPixels > 0 
    ? `Please draw more. Currently ${pixelCount.toLocaleString()} of ${requiredPixels.toLocaleString()} required pixels.`
    : '';
    
  // Auto button tooltip - show different message when an AI image is already loaded
  const autoTooltip = autoDisabled 
    ? 'AI image already applied' 
    : validationTooltip;
    
  return (
    <>
      <style>{`
        @keyframes jiggle {
          0% { transform: rotate(-3deg) scale(1.05); }
          10% { transform: rotate(3deg) scale(1.08); }
          20% { transform: rotate(-2deg) scale(1.04); }
          30% { transform: rotate(2deg) scale(1.07); }
          40% { transform: rotate(-1deg) scale(1.03); }
          50% { transform: rotate(1deg) scale(1.06); }
          60% { transform: rotate(-1deg) scale(1.04); }
          70% { transform: rotate(1deg) scale(1.05); }
          80% { transform: rotate(-2deg) scale(1.03); }
          90% { transform: rotate(2deg) scale(1.07); }
          100% { transform: rotate(-3deg) scale(1.05); }
        }
        .jiggle-anim {
          animation: jiggle 1.2s infinite;
          will-change: transform;
        }
      `}</style>
      <div className="flex justify-end gap-1 mt-2">
        <Button variant="outline" size="sm" onClick={handleUndo} className="min-w-[50px] h-8 text-xs">
          Undo
        </Button>
        <Button variant="outline" size="sm" onClick={handleRedo} className="min-w-[50px] h-8 text-xs">
          Redo
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear} className="min-w-[50px] h-8 text-xs">
          Clear
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAuto} 
          className={`min-w-[50px] h-8 text-xs ${!disabled && !autoDisabled ? "jiggle-anim" : ""}`}
          disabled={disabled || autoDisabled}
          title={autoTooltip}
        >
          Auto
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSubmit} 
          className="min-w-[50px] h-8 text-xs"
          disabled={disabled}
          title={validationTooltip}
        >
          Submit
        </Button>
        <Button variant="default" size="sm" onClick={onClose} className="min-w-[50px] h-8 text-xs">
          Close
        </Button>
      </div>
    </>
  );
};

export default ActionButtons; 