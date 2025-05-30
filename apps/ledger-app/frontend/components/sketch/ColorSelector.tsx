import React from 'react';
import { COLORS } from './sketchConstants';

type PromptChoice = 'dev' | 'cubism' | 'oil' | 'graffiti' | 'residentron';

interface ColorSelectorProps {
  baseColor: string;
  setBaseColor: (color: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  isDropperMode?: boolean;
  setIsDropperMode?: (active: boolean) => void;
  showAutoButton?: boolean;
  promptChoice?: PromptChoice;
  setPromptChoice?: (c: PromptChoice) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  baseColor,
  setBaseColor,
  customColor,
  setCustomColor,
  isDropperMode,
  setIsDropperMode,
  showAutoButton = false,
  promptChoice,
  setPromptChoice,
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
      {/* Selected Color Display + Dropper Button Row */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 px-2 py-1 border rounded bg-white min-w-0" style={{ flex: '1 1 0', maxWidth: 160 }}>
          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: baseColor }} />
          <span className="text-xs sm:text-sm truncate">{getCurrentColorName()}</span>
        </div>
        {setIsDropperMode && (
          <button
            type="button"
            onClick={() => setIsDropperMode(!isDropperMode)}
            className={`px-2 py-1 rounded border text-xs flex items-center gap-1 ${isDropperMode ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'} transition-all`}
            title="Pick color from canvas"
            style={{ whiteSpace: 'nowrap' }}
          >
            <span role="img" aria-label="Dropper">🎨</span> {isDropperMode ? 'Dropper' : 'Pick'}
          </button>
        )}
        {showAutoButton && setPromptChoice && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center ml-2">
            <label className="text-xs font-medium mb-1 sm:mb-0 sm:mr-2" htmlFor="autocomplete-style-select">
              Auto complete styles
            </label>
            <select
              id="autocomplete-style-select"
              value={promptChoice}
              onChange={e => setPromptChoice(e.target.value as PromptChoice)}
              className="px-2 py-1 text-xs border rounded bg-white"
              style={{ minWidth: 120, maxWidth: 180 }}
            >
              <option value="dev">Devs Original</option>
              <option value="cubism">Auto Cubism</option>
              <option value="oil">Auto Oil</option>
              <option value="graffiti">Auto Graffiti</option>
              <option value="residentron">Resident Ron</option>
            </select>
          </div>
        )}
        {isDropperMode && <span className="text-xs text-blue-600 ml-2">Click canvas to pick</span>}
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