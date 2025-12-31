import React from 'react';
import { Waves, X, Play, Pause, Download } from 'lucide-react';

interface HeaderSectionProps {
    setIsOpen: (open: boolean) => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onDownload: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
    setIsOpen,
    isPlaying,
    onTogglePlay,
    onDownload
}) => {
    return (
        <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col gap-3 sm:gap-4 bg-white/5">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-red-900 to-black flex items-center justify-center border border-white/10 shadow-lg shadow-red-900/20">
                        <Waves size={14} className="text-red-500 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-white tracking-widest uppercase">
                            Hiss
                        </h1>
                        <p className="text-[8px] sm:text-[9px] text-zinc-500 font-medium tracking-[0.2em] uppercase">
                            Pattern Gen
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={18} className="sm:w-5 sm:h-5" />
                </button>
            </div>

            {/* Actions Row */}
            <div className="flex gap-2">
                <button
                    onClick={onTogglePlay}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-[10px] sm:text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all uppercase tracking-wider"
                >
                    {isPlaying ? <Pause size={12} className="sm:w-3.5 sm:h-3.5" /> : <Play size={12} className="sm:w-3.5 sm:h-3.5" />}
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                    onClick={onDownload}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-white/10 text-[10px] sm:text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all uppercase tracking-wider"
                >
                    <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                    Export
                </button>
            </div>
        </div>
    );
};
