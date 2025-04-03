import React from 'react';
import { COLORS } from './sketchConstants';

interface ColorSelectorProps {
  baseColor: string;
  setBaseColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  baseColor,
  setBaseColor,
  customColor,
  setCustomColor,
}) => {
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setBaseColor(e.target.value);
  };

  const getCurrentColorName = () => {
    const foundColor = COLORS.find((c) => c.value === baseColor);
    return foundColor ? foundColor.name : "Custom";
  };

  return (
    <>
      {/* Selected Color Display */}
      <div>
        <label className="text-xs font-medium mb-1 block">Selected Color:</label>
        <div className="flex items-center gap-2 px-2 py-1 border rounded bg-white">
          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: baseColor }} />
          <span className="text-xs sm:text-sm">{getCurrentColorName()}</span>
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="text-xs font-medium mb-1 block">Color Palette:</label>
        <div className="grid grid-cols-9 sm:grid-cols-10 gap-1">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setBaseColor(color.value)}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border ${
                baseColor === color.value ? "border-black ring-1 ring-offset-1 ring-gray-400" : "border-gray-300"
              } transition-all duration-150 hover:scale-110`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <button
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border ${
                !COLORS.find((c) => c.value === baseColor)
                  ? "border-black ring-1 ring-offset-1 ring-gray-400"
                  : "border-gray-300"
              } bg-gradient-to-br from-red-500 via-green-500 to-blue-500 transition-all duration-150 hover:scale-110`}
              title="Custom color"
            />
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorSelector; 