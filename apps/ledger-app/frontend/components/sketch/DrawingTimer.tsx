import React from 'react';
import { formatTime } from './sketchConstants';

interface DrawingTimerProps {
  elapsedTime: number;
}

export const DrawingTimer: React.FC<DrawingTimerProps> = ({ elapsedTime }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500">Time:</span>
      <div className="px-2 py-1 text-xs sm:text-sm border rounded bg-white text-center font-medium min-w-[60px]">
        {formatTime(elapsedTime)}
      </div>
    </div>
  );
};

export default DrawingTimer; 