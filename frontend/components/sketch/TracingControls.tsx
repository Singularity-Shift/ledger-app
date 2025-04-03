import React from 'react';

interface TracingControlsProps {
  traceImage: string | null;
  tracingActive: boolean;
  imageScale: number;
  isAdjustMode: boolean;
  handleTraceButtonClick: () => void;
  handleToggleTracing: () => void;
  handleScaleIncrease: () => void;
  handleScaleDecrease: () => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const TracingControls: React.FC<TracingControlsProps> = ({
  traceImage,
  tracingActive,
  imageScale,
  isAdjustMode,
  handleTraceButtonClick,
  handleToggleTracing,
  handleScaleIncrease,
  handleScaleDecrease,
}) => {
  return (
    <>
      {/* Tracing Controls */}
      <div>
        <label className="text-xs font-medium mb-1 block">Tracing:</label>
        <div className="flex gap-1">
          <button
            onClick={handleTraceButtonClick}
            className="flex-1 px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded-l bg-white hover:bg-gray-100 transition-colors"
          >
            📷 Trace
          </button>
          <button
            onClick={handleToggleTracing}
            disabled={!traceImage}
            className={`flex-1 px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded-r ${
              tracingActive && traceImage ? "bg-gray-800 text-white" : "bg-white"
            } hover:bg-gray-100 transition-colors ${!traceImage ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {tracingActive ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Trace Adjustment Controls - only shown when in adjust mode */}
      {isAdjustMode && traceImage && tracingActive && (
        <div className="border rounded p-2 bg-gray-50">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium">Adjust Image:</label>
            <div className="flex gap-1">
              <button
                onClick={handleScaleDecrease}
                className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100"
              >
                🔍-
              </button>
              <div className="text-xs px-2 py-1 bg-white border rounded">{Math.round(imageScale * 100)}%</div>
              <button
                onClick={handleScaleIncrease}
                className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100"
              >
                🔍+
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1 text-center italic">Drag image to position</div>
        </div>
      )}
    </>
  );
};

export default TracingControls; 