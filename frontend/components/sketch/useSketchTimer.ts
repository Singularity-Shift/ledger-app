import { useState, useRef, useEffect } from 'react';

export const useSketchTimer = (
  isOpen: boolean,
  isRestored: boolean,
  initialElapsedTime: number = 0,
  initialDrawingStartTime: number | null = null
) => {
  const [elapsedTime, setElapsedTime] = useState(initialElapsedTime);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime] = useState<number>(initialDrawingStartTime ?? Date.now());

  // Update initial state based on props when they change (especially after restoration)
  useEffect(() => {
    setElapsedTime(initialElapsedTime);
  }, [initialElapsedTime]);

  // Timer management
  useEffect(() => {
    if (isOpen && isRestored) {
      // Only start timer if open and restoration attempt is complete
      console.log("Timer starting/resuming...");
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear interval if portal is closed or before restoration is done
      if (timerIntervalRef.current) {
        console.log("Timer pausing.");
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (timerIntervalRef.current) {
        console.log("Timer cleanup.");
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isOpen, isRestored]);

  // Security token generation for server validation
  const getSecurityToken = () => {
    // Create a verification token that includes a hash of start time
    const verificationData = {
      startTimestamp: startTime,
      currentTimestamp: Date.now(),
      sessionId: sessionStorage.getItem("ledgerDrawingSessionSecret") || "unknown",
      // Include a hash of the combined data
      hash: btoa(`${startTime}:${sessionStorage.getItem("ledgerDrawingSessionSecret") || "unknown"}`),
    };
    return btoa(JSON.stringify(verificationData));
  };

  return {
    elapsedTime,
    setElapsedTime,
    drawingStartTime: startTime,
    getSecurityToken,
  };
};

export default useSketchTimer; 