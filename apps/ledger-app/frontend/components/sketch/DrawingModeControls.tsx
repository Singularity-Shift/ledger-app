import React from 'react';

interface DrawingModeControlsProps {
  isEraser: boolean;
  isAdjustMode: boolean;
  tracingActive: boolean;
  traceImage: string | null;
  setIsEraser: (value: boolean) => void;
  setIsAdjustMode: (value: boolean) => void;
}

export const DrawingModeControls: React.FC<DrawingModeControlsProps> = ({
  isEraser,
  isAdjustMode,
  tracingActive,
  traceImage,
  setIsEraser,
  setIsAdjustMode,
}) => {
  const handleDrawMode = () => {
    setIsEraser(false);
    setIsAdjustMode(false);
  };

  const handleEraseMode = () => {
    setIsEraser(true);
    setIsAdjustMode(false);
  };

  const handleToggleAdjustMode = () => {
    setIsAdjustMode(!isAdjustMode);
    setIsEraser(false); // Ensure eraser is off when adjusting
  };

  return (
    <div>
      <label className="text-xs font-medium mb-1 block">Mode:</label>
      <div className="flex gap-1">
        <button
          onClick={handleDrawMode}
          className={`px-2 py-1 text-xs sm:text-sm border rounded-l flex-1 ${
            !isEraser && !isAdjustMode ? "bg-gray-800 text-white" : "bg-white"
          } hover:bg-gray-100 transition-colors`}
        >
          ✏️ Draw
        </button>
        <button
          onClick={handleEraseMode}
          className={`px-2 py-1 text-xs sm:text-sm border flex-1 ${
            isEraser && !isAdjustMode ? "bg-gray-800 text-white" : "bg-white"
          } hover:bg-gray-100 transition-colors`}
          disabled={isAdjustMode}
        >
          ⚪ Erase
        </button>
        <button
          onClick={handleToggleAdjustMode}
          className={`px-2 py-1 text-xs sm:text-sm border rounded-r flex-1 ${
            isAdjustMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white hover:bg-gray-100"
          }`}
          disabled={!tracingActive || !traceImage}
        >
          🔍 Adjust
        </button>
      </div>
    </div>
  );
};

export default DrawingModeControls; 