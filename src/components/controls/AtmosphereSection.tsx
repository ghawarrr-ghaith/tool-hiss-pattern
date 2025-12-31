import React, { useRef, useState } from 'react';
import { Wind, ChevronDown } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Preset } from '../../types';

interface AtmosphereSectionProps {
    presets: Preset[];
    activePreset: string;
    onPresetChange: (preset: Preset) => void;
}

export const AtmosphereSection: React.FC<AtmosphereSectionProps> = ({
    presets,
    activePreset,
    onPresetChange,
}) => {
    const [isPresetOpen, setIsPresetOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top?: number; bottom?: number; left: number; width: number; maxHeight: number } | null>(null);

    // Helper to sync ref update
    // Note: We might want to lift this state up if multiple dropdowns existed, but for now local is fine.

    return (
        <div className="space-y-3 sm:space-y-4">
            <SectionHeader icon={<Wind size={14} />} label="Atmosphere" />

            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={() => {
                        if (!isPresetOpen && buttonRef.current) {
                            const rect = buttonRef.current.getBoundingClientRect();
                            const viewportHeight = window.innerHeight;
                            const spaceBelow = viewportHeight - rect.bottom - 8; // 8px gap
                            const spaceAbove = rect.top - 8; // 8px gap
                            const maxDropdownHeight = 240; // max-h-60 = 240px

                            // Check if there's enough space below
                            if (spaceBelow >= maxDropdownHeight) {
                                // Position below with full height
                                setDropdownPos({
                                    top: rect.bottom + 8,
                                    left: rect.left,
                                    width: rect.width,
                                    maxHeight: maxDropdownHeight
                                });
                            } else if (spaceAbove >= maxDropdownHeight) {
                                // Position above with full height
                                setDropdownPos({
                                    bottom: viewportHeight - rect.top + 8,
                                    left: rect.left,
                                    width: rect.width,
                                    maxHeight: maxDropdownHeight
                                });
                            } else {
                                // Use available space (prefer below if similar)
                                if (spaceBelow >= spaceAbove) {
                                    setDropdownPos({
                                        top: rect.bottom + 8,
                                        left: rect.left,
                                        width: rect.width,
                                        maxHeight: Math.max(120, spaceBelow - 8)
                                    });
                                } else {
                                    setDropdownPos({
                                        bottom: viewportHeight - rect.top + 8,
                                        left: rect.left,
                                        width: rect.width,
                                        maxHeight: Math.max(120, spaceAbove - 8)
                                    });
                                }
                            }
                        }
                        setIsPresetOpen(!isPresetOpen);
                    }}
                    className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-zinc-900/50 border border-white/10 text-white text-[10px] sm:text-xs font-medium hover:bg-zinc-900 transition-all group"
                >
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">Preset</span>
                        <div className="h-3 sm:h-4 w-[1px] bg-white/10"></div>
                        <span className="truncate">{activePreset}</span>
                    </div>
                    <ChevronDown size={14} className={`text-zinc-500 group-hover:text-white transition-transform duration-300 flex-shrink-0 ${isPresetOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPresetOpen && dropdownPos && (
                    <div
                        className="fixed bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2"
                        style={{
                            top: dropdownPos.top,
                            bottom: dropdownPos.bottom,
                            left: dropdownPos.left,
                            width: dropdownPos.width,
                            maxHeight: dropdownPos.maxHeight
                        }}
                    >
                        {presets.map((preset, index) => (
                            <button
                                key={preset.name}
                                onClick={() => {
                                    onPresetChange(preset);
                                    setIsPresetOpen(false);
                                }}
                                className={`group w-full text-left px-4 py-3.5 text-xs flex items-center justify-between transition-all duration-200 border-b border-white/5 last:border-0 relative overflow-hidden first:rounded-t-xl last:rounded-b-xl ${activePreset === preset.name
                                    ? 'bg-gradient-to-r from-white/10 to-white/5 text-white'
                                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                style={{
                                    animationDelay: `${index * 30}ms`
                                }}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="flex gap-1 p-1 rounded-lg bg-black/20 ring-1 ring-white/5">
                                        {preset.colors.slice(0, 4).map((c, i) => (
                                            <div
                                                key={i}
                                                className="w-3 h-3 rounded-md ring-1 ring-black/50 transition-transform group-hover:scale-110"
                                                style={{
                                                    backgroundColor: c,
                                                    transitionDelay: `${i * 30}ms`
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-medium tracking-wide">{preset.name}</span>
                                </div>
                                {activePreset === preset.name && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse relative z-10" />
                                    </>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
