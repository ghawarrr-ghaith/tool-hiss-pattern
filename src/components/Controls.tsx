import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { ControlsProps } from '../types';
import { HeaderSection } from './controls/HeaderSection';
import { DynamicsSection } from './controls/DynamicsSection';
import { AtmosphereSection } from './controls/AtmosphereSection';
import { PaletteSection } from './controls/PaletteSection';

export const Controls: React.FC<ControlsProps> = ({
    presets,
    activePreset,
    onPresetChange,
    colors,
    onColorChange,
    onRandomizeColors,
    centerForce,
    setCenterForce,
    complexity,
    setComplexity,
    isPlaying,
    onTogglePlay,
    onDownload,
}) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-6 left-6 z-50 p-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-all shadow-xl group hover:scale-110"
            >
                <Menu size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
        );
    }

    return (
        <aside className="fixed top-0 left-0 h-full w-full sm:w-96 md:w-80 bg-zinc-950/95 backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col transition-all duration-300 ease-out shadow-2xl">

            <HeaderSection
                setIsOpen={setIsOpen}
                isPlaying={isPlaying}
                onTogglePlay={onTogglePlay}
                onDownload={onDownload}
            />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar">

                <DynamicsSection
                    centerForce={centerForce}
                    setCenterForce={setCenterForce}
                    complexity={complexity}
                    setComplexity={setComplexity}
                />

                <AtmosphereSection
                    presets={presets}
                    activePreset={activePreset}
                    onPresetChange={onPresetChange}
                />

                <PaletteSection
                    colors={colors}
                    onColorChange={onColorChange}
                    onRandomize={onRandomizeColors}
                />

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-white/5 bg-zinc-950/50 backdrop-blur-sm">
                <div className="text-[9px] sm:text-[10px] text-zinc-600 font-mono text-center uppercase tracking-widest">
                    WebGL Fragment Shader
                </div>
            </div>
        </aside>
    );
};
