import React from "react";
import { PencilGrade } from "./sketchTypes";
import { PENCIL_GRADES } from "./sketchConstants";

interface PencilGradeSelectorProps {
  selectedGrade: PencilGrade;
  setSelectedGrade: (grade: PencilGrade) => void;
  onPaintBucketClick?: () => void;
  isPaintBucketActive?: boolean;
  onSmudgeClick?: () => void;
  isSmudgeActive?: boolean;
}

export const PencilGradeSelector: React.FC<PencilGradeSelectorProps> = ({
  selectedGrade,
  setSelectedGrade,
  onPaintBucketClick,
  isPaintBucketActive,
  onSmudgeClick,
  isSmudgeActive,
}) => {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block">Pencil Grade:</label>
      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
        {PENCIL_GRADES.map((grade, _idx) => (
          <React.Fragment key={grade.label}>
            <button
              onClick={() => setSelectedGrade(grade)}
              className={`px-1 py-0.5 text-xs border rounded ${
                selectedGrade.label === grade.label ? "bg-gray-800 text-white" : "bg-white"
              } hover:bg-gray-100 transition-colors`}
              title={grade.description}
            >
              {grade.label}
            </button>
            {grade.label === "9B" && (
              <>
                <button
                  type="button"
                  onClick={onPaintBucketClick}
                  className={`px-1 py-0.5 text-xs border rounded ml-2 flex items-center gap-1 transition-colors ${isPaintBucketActive ? "bg-blue-400 text-white border-blue-600" : "bg-blue-100 hover:bg-blue-200"}`}
                  title="Paint Bucket (Fill) Tool"
                >
                  <span role="img" aria-label="Paint Bucket">
                    🪣
                  </span>{" "}
                  Fill
                </button>
                <button
                  type="button"
                  onClick={onSmudgeClick}
                  className={`px-1 py-0.5 text-xs border rounded ml-1 flex items-center gap-1 transition-colors ${isSmudgeActive ? "bg-purple-400 text-white border-purple-600" : "bg-purple-100 hover:bg-purple-200"}`}
                  title="Smudge Tool"
                >
                  <span role="img" aria-label="Smudge">
                    👉
                  </span>{" "}
                  Smudge
                </button>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PencilGradeSelector;
