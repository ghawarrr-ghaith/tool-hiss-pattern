import React from 'react';

export const SectionHeader: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest pb-2 border-b border-white/5">
        {icon}
        <span>{label}</span>
    </div>
);
