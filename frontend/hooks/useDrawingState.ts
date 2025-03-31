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
  signature?: string; // Cryptographic signature to prevent tampering
}

const LOCAL_STORAGE_KEY = 'ledgerDrawingState';

// Create a session key that changes for each browser session
// This prevents users from preparing localStorage values in advance
const SESSION_SECRET = (() => {
  // Check if we already have a session secret
  let secret = sessionStorage.getItem('ledgerDrawingSessionSecret');
  if (!secret) {
    // Create a random session secret if none exists
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    secret = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('ledgerDrawingSessionSecret', secret);
  }
  return secret;
})();

// Calculate HMAC-like signature for state verification
// This is a simplified version - in production, use a proper HMAC implementation
const calculateSignature = (state: Omit<DrawingState, 'signature'>): string => {
  try {
    // Create a string representation of state without the signature field
    const stateString = JSON.stringify({
      drawingPaths: state.drawingPaths,
      elapsedTime: state.elapsedTime,
      lastActiveTimestamp: state.lastActiveTimestamp,
      traceImage: state.traceImage ? '[TRACE_IMAGE_DATA]' : null, // Replace actual image data with placeholder to keep signature shorter
      traceConfig: state.traceConfig,
      pencilConfig: state.pencilConfig
    });
    
    // Use a combination of the data, session secret, and timestamp for the signature
    // In production, use proper crypto libraries for this
    const signature = btoa(`${stateString}:${SESSION_SECRET}:${state.lastActiveTimestamp}`);
    return signature;
  } catch (error) {
    console.error("Failed to calculate signature:", error);
    return '';
  }
};

// Helper function to load state from localStorage
const loadStateFromStorage = (): DrawingState | null => {
  try {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState) as DrawingState;
      
      // Basic validation
      if (parsedState && typeof parsedState === 'object') {
        // Verify the signature if it exists
        if (parsedState.signature) {
          const stateWithoutSignature = { ...parsedState };
          const savedSignature = stateWithoutSignature.signature;
          delete stateWithoutSignature.signature;
          
          const calculatedSignature = calculateSignature(stateWithoutSignature);
          
          // If signatures don't match, state was tampered with
          if (savedSignature !== calculatedSignature) {
            console.warn("Drawing state signature mismatch - possible tampering detected!");
            return null;
          }
        } else {
          // If there's no signature, this is either old data or manually created
          console.warn("Drawing state missing signature - discarding potentially unsafe data");
          return null;
        }
        
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
    // Add a signature to the state to prevent tampering
    const stateToSave = { ...state };
    // Generate signature from state without existing signature
    delete stateToSave.signature;
    stateToSave.signature = calculateSignature(stateToSave);
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
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