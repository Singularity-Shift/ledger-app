import React from 'react';
import { PencilGrade } from './sketchTypes';
import { PENCIL_GRADES } from './sketchConstants';

interface PencilGradeSelectorProps {
  selectedGrade: PencilGrade;
  setSelectedGrade: (grade: PencilGrade) => void;
}

export const PencilGradeSelector: React.FC<PencilGradeSelectorProps> = ({
  selectedGrade,
  setSelectedGrade,
}) => {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block">Pencil Grade:</label>
      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
        {PENCIL_GRADES.map((grade) => (
          <button
            key={grade.label}
            onClick={() => setSelectedGrade(grade)}
            className={`px-1 py-0.5 text-xs border rounded ${
              selectedGrade.label === grade.label ? "bg-gray-800 text-white" : "bg-white"
            } hover:bg-gray-100 transition-colors`}
            title={grade.description}
          >
            {grade.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PencilGradeSelector; 