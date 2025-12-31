import React from 'react';
import { CrimsonShader } from './components/CrimsonShader';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Global Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      {/* The background visual */}
      <CrimsonShader />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-10"></div>

      {/* Optional Overlay to demonstrate it works as a background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-1000 z-20">
        <div className="text-white/20 text-sm font-light tracking-[0.5em] uppercase">
          Procedural Fluid Dynamics
        </div>
      </div>
    </div>
  );
};

export default App;