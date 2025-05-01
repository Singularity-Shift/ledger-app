import React from 'react';

interface TraceImageLayerProps {
  traceImage: string | null;
  tracingActive: boolean;
  imagePosition: { x: number; y: number };
  imageScale: number;
}

export const TraceImageLayer: React.FC<TraceImageLayerProps> = ({
  traceImage,
  tracingActive,
  imagePosition,
  imageScale,
}) => {
  if (!tracingActive || !traceImage) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.35,
        zIndex: 4,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <img
        src={traceImage}
        alt="Tracing Reference"
        style={{
          position: "absolute",
          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
          transformOrigin: "center",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
};

export default TraceImageLayer; 