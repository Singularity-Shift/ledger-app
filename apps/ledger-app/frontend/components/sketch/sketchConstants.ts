import { PencilGrade, SketchColor } from './sketchTypes';

// Pencil grades with opacity levels
export const PENCIL_GRADES: PencilGrade[] = [
  { label: "9H", opacity: 0.03, description: "Hardest, faintest" },
  { label: "8H", opacity: 0.05, description: "Ultra hard, extremely light" },
  { label: "7H", opacity: 0.07, description: "Very very hard, very faint" },
  { label: "6H", opacity: 0.1, description: "Extra hard, very light" },
  { label: "5H", opacity: 0.12, description: "Very hard, light" },
  { label: "4H", opacity: 0.15, description: "Hard, light" },
  { label: "3H", opacity: 0.2, description: "Medium hard, light" },
  { label: "2H", opacity: 0.25, description: "Medium hard" },
  { label: "H", opacity: 0.3, description: "Hard" },
  { label: "F", opacity: 0.35, description: "Fine, between H and HB" },
  { label: "HB", opacity: 0.4, description: "Medium, balanced" },
  { label: "B", opacity: 0.55, description: "Soft" },
  { label: "2B", opacity: 0.65, description: "Softer, darker" },
  { label: "3B", opacity: 0.75, description: "Very soft" },
  { label: "4B", opacity: 0.8, description: "Very soft, dark" },
  { label: "5B", opacity: 0.85, description: "Extra soft" },
  { label: "6B", opacity: 0.9, description: "Extra soft, very dark" },
  { label: "7B", opacity: 0.95, description: "Ultra soft, very dark" },
  { label: "8B", opacity: 0.97, description: "Ultra soft, darkest" },
  { label: "9B", opacity: 1, description: "Softest, maximum darkness" },
];

// Predefined colors
export const COLORS: SketchColor[] = [
  { name: "Graphite", value: "#333333" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#FF0000" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Blue", value: "#0000FF" },
  { name: "Orange", value: "#FFA500" },
  { name: "Green", value: "#00FF00" },
  { name: "Purple", value: "#800080" },
  { name: "Sepia", value: "#704214" },
  { name: "Teal", value: "#008080" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Violet", value: "#8F00FF" },
  { name: "Navy", value: "#000080" },
  { name: "Forest", value: "#228B22" },
  { name: "Maroon", value: "#800000" },
  { name: "Gold", value: "#FFD700" },
];

// Find PencilGrade by label
export const findGradeByLabel = (label: string): PencilGrade | undefined => {
  return PENCIL_GRADES.find((grade) => grade.label === label);
};

// Format time for display
export const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};

// Custom cursors
export const pencilCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'%3E%3C/path%3E%3C/svg%3E") 0 24, auto`;

export const eraserCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.48 3.52a3.2 3.2 0 0 0-4.53 0L3.52 15.95a3.2 3.2 0 0 0 0 4.53l4.53-4.53 8.47-8.47 4.53-4.53a3.2 3.2 0 0 0 0-4.53z'%3E%3C/path%3E%3C/svg%3E") 0 24, auto`; 