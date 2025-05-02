import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
  handleSubmit: () => void;
  handleAuto: () => void;
  onClose: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleUndo,
  handleRedo,
  handleClear,
  handleSubmit,
  handleAuto,
  onClose,
}) => {
  return (
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
      <Button variant="outline" size="sm" onClick={handleAuto} className="min-w-[50px] h-8 text-xs">
        Auto
      </Button>
      <Button variant="outline" size="sm" onClick={handleSubmit} className="min-w-[50px] h-8 text-xs">
        Submit
      </Button>
      <Button variant="default" size="sm" onClick={onClose} className="min-w-[50px] h-8 text-xs">
        Close
      </Button>
    </div>
  );
};

export default ActionButtons; 