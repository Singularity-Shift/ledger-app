import { useState, useEffect, useCallback } from 'react';

// Define the structure for the saved drawing state
interface DrawingState {
  drawingPaths: any[] | null; // Store paths from react-sketch-canvas
  elapsedTime: number;
  lastActiveTimestamp: number | null;
  traceImage: string | null;
  traceConfig: {
    active: boolean;
    position: { x: number; y: number };
    scale: number;
  } | null;
  pencilConfig: {
    color: string;
    width: number;
    gradeLabel: string; // Store the label to find the grade object later
    isEraser: boolean;
  } | null;
}

const LOCAL_STORAGE_KEY = 'ledgerDrawingState';

// Helper function to load state from localStorage
const loadStateFromStorage = (): DrawingState | null => {
  try {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState) as DrawingState;
      // Basic validation
      if (parsedState && typeof parsedState === 'object') {
         // Add more specific validation if needed
        return parsedState;
      }
    }
  } catch (error) {
    console.error("Failed to load drawing state from localStorage:", error);
  }
  return null;
};

// Helper function to save state to localStorage
const saveStateToStorage = (state: DrawingState) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save drawing state to localStorage:", error);
  }
};

// Helper function to clear state from localStorage
const clearStateFromStorage = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear drawing state from localStorage:", error);
  }
};

export const useDrawingState = () => {
  const [state, setState] = useState<DrawingState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state from localStorage on mount
  useEffect(() => {
    const loadedState = loadStateFromStorage();
    if (loadedState) {
        setState(loadedState);
    }
    setIsLoaded(true); // Mark as loaded even if no state was found
  }, []);

  // Function to update and save the state
  const saveDrawingState = useCallback((newState: Partial<DrawingState>) => {
    setState(prevState => {
      const updatedState = { ...(prevState || {} as DrawingState), ...newState };
      saveStateToStorage(updatedState);
      return updatedState;
    });
  }, []);

  // Function to clear the state
  const clearDrawingState = useCallback(() => {
    setState(null);
    clearStateFromStorage();
  }, []);

  // Function to update only the timestamp without triggering a re-render if possible
  // (Though updating state will usually cause a render)
   const updateTimestamp = useCallback(() => {
    setState(prevState => {
      if (!prevState) return null;
      const updatedState = { ...prevState, lastActiveTimestamp: Date.now() };
      saveStateToStorage(updatedState); // Save silently
      return updatedState; // This will still cause a render
    });
  }, []);


  return {
    drawingState: state,
    saveDrawingState,
    clearDrawingState,
    updateTimestamp,
    isDrawingStateLoaded: isLoaded, // Flag to indicate initial load attempt is complete
  };
}; 