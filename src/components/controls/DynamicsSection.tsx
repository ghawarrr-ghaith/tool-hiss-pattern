import React from 'react';
import { Orbit } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface DynamicsSectionProps {
    centerForce: boolean;
    setCenterForce: (force: boolean) => void;
    complexity: number;
    setComplexity: (val: number) => void;
}

export const DynamicsSection: React.FC<DynamicsSectionProps> = ({
    centerForce,
    setCenterForce,
    complexity,
    setComplexity,
}) => {
    return (
        <div className="space-y-3 sm:space-y-4">
            <SectionHeader icon={<Orbit size={14} />} label="Dynamics" />

            {/* Singularity Toggle */}
            <button
                onClick={() => setCenterForce(!centerForce)}
                className={`w-full group relative overflow-hidden p-3 sm:p-4 rounded-xl border transition-all duration-300 ${centerForce
                    ? 'bg-red-900/20 border-red-500/30 text-red-200'
                    : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
                    }`}
            >
                <div className="flex items-center justify-between relative z-10">
                    <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Singularity Mode</span>
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${centerForce ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-zinc-700'}`} />
                </div>
                {centerForce && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-50" />
                )}
            </button>

            {/* Complexity Slider */}
            <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-[10px] sm:text-xs font-medium text-zinc-500">
                    <span className="uppercase tracking-wider">Complexity</span>
                    <span className="font-mono text-zinc-400">{complexity.toFixed(1)}</span>
                </div>
                <div className="relative w-full h-8 sm:h-10 flex items-center">
                    <input
                        type="range"
                        min="1.0"
                        max="8.0"
                        step="0.1"
                        value={complexity}
                        onChange={(e) => setComplexity(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};
