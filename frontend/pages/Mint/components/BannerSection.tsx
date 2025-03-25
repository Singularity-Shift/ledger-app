import { useMemo } from "react";
// Internal utils
import { cn } from "@/lib/utils";

interface BannerSectionProps {
  className?: string;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ className }) => {
  // Create an array of colors that alternates between white, yellow, and blue
  const colors = useMemo(() => {
    const baseColors = ["#FFF", "#FFEB3B", "#2196F3"]; // White (paper), Yellow, Blue
    let result: string[] = [];
    while (result.length < 60) {
      result = result.concat(baseColors);
    }
    return result;
  }, []);

  return (
    <div className={cn("w-full grid grid-cols-[repeat(30,minmax(136px,1fr))] grid-rows-2 gap-4 -mx-16", className)}>
      {colors.slice(0, 60).map((color, i) => {
        return (
          <div 
            className="rounded-lg aspect-square shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgb(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300" 
            style={{ backgroundColor: color }}
            key={`color-${i}`}
          />
        );
      })}
    </div>
  );
};
