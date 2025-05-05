// Types for the Sketch components

// Pencil grades with opacity levels
export type PencilGrade = {
  label: string;
  opacity: number;
  description: string;
};

// Color definition
export type SketchColor = {
  name: string;
  value: string;
};

// Drawing state interface
export interface DrawingState {
  drawingPaths?: any[];
  elapsedTime?: number;
  lastActiveTimestamp?: number;
  drawingStartTime?: number;
  traceImage?: string | null;
  traceConfig?: {
    active?: boolean;
    position?: { x: number; y: number };
    scale?: number;
  };
  pencilConfig?: {
    color?: string;
    width?: number;
    gradeLabel?: string;
    isEraser?: boolean;
  };
}

// Props for the main portal component
export interface PencilSketchPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (
    file: File,
    drawingTime: number,
    drawPath: string,
    id: string,
    usedTracing: boolean,
    usedAutoComplete: boolean,
    securityToken: string,
  ) => void;
}
