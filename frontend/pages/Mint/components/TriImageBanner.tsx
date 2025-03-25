// Internal components
import { Image } from "@/components/ui/image";
// Internal assets
import Paper from "@/assets/placeholders/paper.jpg";

export function TriImageBanner({ className }: { className?: string }) {
  return (
    <div className={className + " whitespace-nowrap relative"}>
      {/* Paper image */}
      <Image
        style={{
          width: "50%",
          aspectRatio: "1/1",
          display: "inline-block",
          position: "relative",
          zIndex: "0",
        }}
        rounded
        src={Paper}
        key="paper-image"
      />
      
      {/* Colored squares */}
      <div
        style={{
          width: `40%`,
          aspectRatio: "1/1",
          display: "inline-block",
          position: "absolute",
          top: "10%",
          right: "30%",
          zIndex: "-1",
          backgroundColor: "#FFEB3B",
          borderRadius: "8px",
        }}
        key="color-yellow"
      />
      <div
        style={{
          width: `30%`,
          aspectRatio: "1/1",
          display: "inline-block",
          position: "absolute",
          top: "20%",
          right: "10%",
          zIndex: "-2",
          backgroundColor: "#2196F3",
          borderRadius: "8px",
        }}
        key="color-blue"
      />
    </div>
  );
}
