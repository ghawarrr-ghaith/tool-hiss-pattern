import React, { useState } from 'react';
import { X, Download, Layout, Smartphone, Monitor, Settings } from 'lucide-react';

interface ResolutionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (width: number, height: number, split?: boolean) => void;
    currentWidth: number;
    currentHeight: number;
}

type ResolutionType = 'viewport' | '1080p' | '4k' | 'instagram-post' | 'instagram-carousel' | 'custom';

export const ResolutionDialog: React.FC<ResolutionDialogProps> = ({
    isOpen,
    onClose,
    onExport,
    currentWidth,
    currentHeight
}) => {
    const [type, setType] = useState<ResolutionType>('viewport');
    const [customWidth, setCustomWidth] = useState(currentWidth);
    const [customHeight, setCustomHeight] = useState(currentHeight);
    const [carouselSlides, setCarouselSlides] = useState(3);
    const [splitSlides, setSplitSlides] = useState(true);

    if (!isOpen) return null;

    const handleExport = () => {
        let width = currentWidth;
        let height = currentHeight;

        switch (type) {
            case '1080p':
                width = 1920;
                height = 1080;
                break;
            case '4k':
                width = 3840;
                height = 2160;
                break;
            case 'instagram-post':
                width = 1080;
                height = 1350;
                break;
            case 'instagram-carousel':
                width = 1080 * carouselSlides;
                height = 1350;
                break;
            case 'custom':
                width = customWidth;
                height = customHeight;
                break;
            default:
                break;
        }

        onExport(width, height, type === 'instagram-carousel' && splitSlides);
        onClose();
    };

    const options = [
        { id: 'viewport', label: 'Viewport', sub: `${currentWidth}x${currentHeight}`, icon: Monitor },
        { id: '1080p', label: 'Full HD', sub: '1920x1080', icon: Monitor },
        { id: '4k', label: '4K Ultra HD', sub: '3840x2160', icon: Monitor },
        { id: 'instagram-post', label: 'IG Post', sub: '1080x1350', icon: Smartphone },
        { id: 'instagram-carousel', label: 'IG Carousel', sub: 'Multi-slide', icon: Layout },
        { id: 'custom', label: 'Custom', sub: 'Manual input', icon: Settings },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-wider uppercase">Export Resolution</h2>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Select output dimensions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((opt) => {
                            const Icon = opt.icon;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => setType(opt.id as ResolutionType)}
                                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left ${type === opt.id
                                        ? 'bg-red-500/10 border-red-500/50 text-white shadow-lg shadow-red-500/10'
                                        : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:border-white/10'
                                        }`}
                                >
                                    <Icon size={18} className={type === opt.id ? 'text-red-500' : 'text-zinc-500'} />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider">{opt.label}</div>
                                        <div className="text-[10px] opacity-60 font-mono">{opt.sub}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {type === 'instagram-carousel' && (
                        <div className="p-4 bg-zinc-800/50 border border-white/5 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                            <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Number of Slides</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="2"
                                    max="10"
                                    value={carouselSlides}
                                    onChange={(e) => setCarouselSlides(parseInt(e.target.value))}
                                    className="flex-1 accent-red-500"
                                />
                                <span className="text-xl font-bold text-white min-w-[1.5rem] text-center">{carouselSlides}</span>
                            </div>
                            <div className="text-[10px] text-zinc-600 font-mono text-center">
                                Resulting width: <span className="text-red-500/80">{1080 * carouselSlides}px</span>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-white/5">
                                <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest cursor-pointer" htmlFor="split-toggle">
                                    Split into numbered slides
                                </label>
                                <button
                                    id="split-toggle"
                                    onClick={() => setSplitSlides(!splitSlides)}
                                    className={`w-10 h-5 rounded-full p-1 transition-colors ${splitSlides ? 'bg-red-500' : 'bg-zinc-700'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${splitSlides ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {splitSlides && (
                                <p className="text-[9px] text-zinc-600 italic">
                                    Will download {carouselSlides} separate images (1080x1350).
                                </p>
                            )}
                        </div>
                    )}

                    {type === 'custom' && (
                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Width</label>
                                <input
                                    type="number"
                                    value={customWidth}
                                    onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-red-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Height</label>
                                <input
                                    type="number"
                                    value={customHeight}
                                    onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-red-500/50"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-zinc-950/50 border-t border-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 p-3 rounded-xl border border-white/5 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex-1 p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={14} />
                        Export PNG
                    </button>
                </div>
            </div>
        </div>
    );
};
