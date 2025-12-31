export interface Preset {
  name: string;
  colors: string[];
}

export interface ControlsProps {
  presets: Preset[];
  activePreset: string;
  onPresetChange: (preset: Preset) => void;
  colors: string[];
  onColorChange: (index: number, val: string) => void;
  centerForce: boolean;
  setCenterForce: (force: boolean) => void;
  complexity: number;
  setComplexity: (val: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onDownload: () => void;
}
