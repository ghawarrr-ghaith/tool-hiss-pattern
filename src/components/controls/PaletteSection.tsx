import React from 'react';
import { Palette } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface PaletteSectionProps {
    colors: string[];
    onColorChange: (index: number, val: string) => void;
}

export const PaletteSection: React.FC<PaletteSectionProps> = ({
    colors,
    onColorChange,
}) => {
    return (
        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-white/5">
            <SectionHeader icon={<Palette size={14} />} label="Tune Palette" />
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {colors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 group">
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-white/30 transition-all shadow-md group-hover:scale-105 duration-200">
                            <div className="absolute inset-0" style={{ backgroundColor: color }} />
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => onColorChange(idx, e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
