import React from 'react';

interface StrokeWidthControlProps {
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
}

export const StrokeWidthControl: React.FC<StrokeWidthControlProps> = ({
  strokeWidth,
  setStrokeWidth,
}) => {
  return (
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
  );
};

export default StrokeWidthControl; 