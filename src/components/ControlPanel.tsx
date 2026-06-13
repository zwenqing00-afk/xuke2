import React from 'react';
import { HeartParams, FormulaType, MouseEffectType } from '../types';
import { 
  Heart, 
  Flame, 
  Sparkles, 
  Activity, 
  Sliders, 
  Volume2, 
  VolumeX, 
  MousePointer, 
  RefreshCw, 
  Pipette,
  Gauge
} from 'lucide-react';

interface ControlPanelProps {
  params: HeartParams;
  onChange: (updates: Partial<HeartParams>) => void;
}

export default function ControlPanel({ params, onChange }: ControlPanelProps) {
  // Preset definitions for users to quickly apply setups
  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'standard-romance':
        onChange({
          formula: 'standard',
          bpm: 72,
          particleCount: 1500,
          color: '#EEAEEE',
          size: 1.5,
          scatterBeta: 0.15,
          glowEffect: true,
          gravity: 0,
          mouseEffect: 'gravitate',
        });
        break;
      case 'cyberpunk-neon':
        onChange({
          formula: 'user', // user formula
          bpm: 110,
          particleCount: 2200,
          color: '#ff2e63', // hot pink
          size: 2.2,
          scatterBeta: 0.22,
          glowEffect: true,
          gravity: 0.2,
          mouseEffect: 'repel',
        });
        break;
      case 'rainbow-dust':
        onChange({
          formula: 'tall',
          bpm: 85,
          particleCount: 2800,
          color: 'rainbow',
          size: 1.2,
          scatterBeta: 0.13,
          glowEffect: false,
          gravity: -0.3, // floats upwards!
          mouseEffect: 'explode',
        });
        break;
      case 'cozy-candle':
        onChange({
          formula: 'cardioid',
          bpm: 50,
          particleCount: 1000,
          color: '#ffaa00', // warm gold candle
          size: 1.6,
          scatterBeta: 0.08,
          glowEffect: true,
          gravity: -0.1,
          mouseEffect: 'none',
        });
        break;
      default:
        break;
    }
  };

  const colors = [
    { name: 'Rose Quartz', value: '#EEAEEE' }, // user's choice #EEAEEE
    { name: 'Neon Crimson', value: '#FF2E63' },
    { name: 'Electric Cyan', value: '#08D9D6' },
    { name: 'Warm Amber', value: '#FF9F43' },
    { name: 'Ultraviolet', value: '#9b5de5' },
    { name: 'Rainbow Mode', value: 'rainbow' },
  ];

  return (
    <div id="settings-control-panel" className="bg-[#12121a]/95 border border-gray-800/60 rounded-2xl p-6 text-left flex flex-col gap-6 h-full shadow-lg">
      
      {/* Title & Presets Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-pink-400" />
          <h2 className="text-lg font-mono font-medium text-white tracking-tight">Parameters</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Control the mathematical geometry, physics forces, and audio synthesis in real-time.
        </p>
        
        {/* Presets Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => applyPreset('standard-romance')}
            className="flex items-center gap-1.5 justify-center py-2 px-3 text-[11px] rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 font-mono transition-all"
            id="preset-standard"
          >
            <Heart className="w-3.5 h-3.5 text-pink-300" />
            Standard Loop
          </button>
          <button
            onClick={() => applyPreset('cyberpunk-neon')}
            className="flex items-center gap-1.5 justify-center py-2 px-3 text-[11px] rounded-lg border border-pink-500/10 bg-pink-500/5 hover:bg-pink-500/10 text-pink-200 font-mono transition-all"
            id="preset-cyber"
          >
            <Activity className="w-3.5 h-3.5 text-pink-500" />
            Cyber Pulse
          </button>
          <button
            onClick={() => applyPreset('rainbow-dust')}
            className="flex items-center gap-1.5 justify-center py-2 px-3 text-[11px] rounded-lg border border-teal-500/10 bg-teal-500/5 hover:bg-teal-500/10 text-teal-200 font-mono transition-all"
            id="preset-rainbow"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Rainbow Dust
          </button>
          <button
            onClick={() => applyPreset('cozy-candle')}
            className="flex items-center gap-1.5 justify-center py-2 px-3 text-[11px] rounded-lg border border-orange-500/10 bg-orange-500/5 hover:bg-orange-500/10 text-orange-200 font-mono transition-all"
            id="preset-candle"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Cozy Candle
          </button>
        </div>
      </div>

      <hr className="border-gray-800/60" />

      {/* Physics Engine & Audio Toggle */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-medium text-gray-300">Heartbeat Sound (Web Audio Synth)</span>
          <button
            onClick={() => onChange({ soundEnabled: !params.soundEnabled })}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-mono transition-all ${
              params.soundEnabled 
                ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300' 
                : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10'
            }`}
            id="sound-toggle-btn"
          >
            {params.soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                Enabled
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                Muted
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 font-sans leading-relaxed leading-snug">
          Generates a low-frequency synthesized &apos;lub-dub&apos; pitch when the heart contracts. (Requires a user interaction to trigger browser audio node).
        </p>
      </div>

      <hr className="border-gray-800/60" />

      {/* Primary Mathematical Geometry Equations */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-mono font-medium text-gray-300 block mb-2">Equation Shell Family</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'user', label: "Victor's Equation (Prompt)" },
              { id: 'standard', label: 'Classic Mathematical' },
              { id: 'tall', label: 'Extended Tall' },
              { id: 'cardioid', label: 'Cardioid Polar' },
              { id: 'custom', label: 'Custom Equation' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => onChange({ formula: f.id as FormulaType })}
                className={`py-2 px-3 text-[11px] font-mono text-left rounded-lg border transition-all ${
                  params.formula === f.id
                    ? 'bg-pink-500/10 border-pink-500/40 text-pink-300'
                    : 'bg-black/35 border-white/5 text-gray-400 hover:bg-white/5'
                }`}
                id={`formula-select-${f.id}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom parametric sliders only visible if the user requests "Custom Equation" */}
        {params.formula === 'custom' && (
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-3 font-mono">
            <h4 className="text-[11px] text-pink-300 font-semibold uppercase tracking-wider mb-1">Custom Formula Coefficients</h4>
            
            {/* Custom X1 term */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>X Coefficient: <code className="text-white">x = A * sin³(t)</code></span>
                <span className="text-pink-300">{params.customParamX1}</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={params.customParamX1}
                onChange={(e) => onChange({ customParamX1: Number(e.target.value) })}
                className="w-full accent-pink-500 h-1 bg-gray-800 rounded-lg cursor-pointer"
                id="coeff-x1"
              />
            </div>

            {/* Custom Y1 term */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Y₁ term: <code className="text-white">B * cos(t)</code></span>
                <span className="text-pink-300">{params.customParamY1}</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={params.customParamY1}
                onChange={(e) => onChange({ customParamY1: Number(e.target.value) })}
                className="w-full accent-pink-500 h-1 bg-gray-800 rounded-lg cursor-pointer"
                id="coeff-y1"
              />
            </div>

            {/* Custom Y2 term */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Y₂ term: <code className="text-white">C * cos(2t)</code></span>
                <span className="text-pink-300">{params.customParamY2}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={params.customParamY2}
                onChange={(e) => onChange({ customParamY2: Number(e.target.value) })}
                className="w-full accent-pink-500 h-1 bg-gray-800 rounded-lg cursor-pointer"
                id="coeff-y2"
              />
            </div>

            {/* Custom Y3 term */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Y₃ term: <code className="text-white">D * cos(3t)</code></span>
                <span className="text-pink-300">{params.customParamY3}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={params.customParamY3}
                onChange={(e) => onChange({ customParamY3: Number(e.target.value) })}
                className="w-full accent-pink-500 h-1 bg-gray-800 rounded-lg cursor-pointer"
                id="coeff-y3"
              />
            </div>
          </div>
        )}

        {/* BPM Pulse Frequency Slider */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-gray-300">Pulse Rate (BPM)</span>
            <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">{params.bpm} bpm</span>
          </div>
          <input
            type="range"
            min="30"
            max="180"
            step="1"
            value={params.bpm}
            onChange={(e) => onChange({ bpm: Number(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg cursor-pointer accent-pink-500"
            id="bpm-slider"
          />
        </div>

        {/* Particles Density */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-gray-300">Particle Density</span>
            <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">{params.particleCount} dots</span>
          </div>
          <input
            type="range"
            min="300"
            max="4000"
            step="50"
            value={params.particleCount}
            onChange={(e) => onChange({ particleCount: Number(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg cursor-pointer accent-pink-500"
            id="particle-count-slider"
          />
        </div>

        {/* Scatter Beta Dispersion */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-2 bg-pink-950/20 p-1.5 rounded-lg border border-pink-900/30">
            <span className="text-gray-300">Inward Beta Scatter (β)</span>
            <span className="text-pink-400 font-mono font-bold bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">{params.scatterBeta.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.45"
            step="0.01"
            value={params.scatterBeta}
            onChange={(e) => onChange({ scatterBeta: Number(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg cursor-pointer accent-pink-500"
            id="beta-scatter-slider"
          />
          <span className="text-[9px] text-gray-500 font-sans block mt-1">
            Controls internal exponential dispersion based on the log scatter distribution of the vector boundary shell.
          </span>
        </div>

        {/* Particle Diameter Size */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-gray-300">Particle Radius</span>
            <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">{params.size}px</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.1"
            value={params.size}
            onChange={(e) => onChange({ size: Number(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg cursor-pointer accent-pink-500"
            id="size-slider"
          />
        </div>

        {/* Wind gravity warped physics */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-gray-300">Gravitational Gravity / Wind</span>
            <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">{(params.gravity > 0 ? '+' : '') + params.gravity}</span>
          </div>
          <input
            type="range"
            min="-1.5"
            max="1.5"
            step="0.1"
            value={params.gravity}
            onChange={(e) => onChange({ gravity: Number(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg cursor-pointer accent-pink-500"
            id="gravity-slider"
          />
        </div>

        {/* Mouse Interaction Style selection */}
        <div>
          <label className="text-xs font-mono font-medium text-gray-300 block mb-2">Mouse Over Influence</label>
          <div className="grid grid-cols-3 gap-1.5 font-mono">
            {[
              { id: 'repel', label: 'Repel' },
              { id: 'gravitate', label: 'Attract' },
              { id: 'explode', label: 'Chaotic' },
            ].map((eff) => (
              <button
                key={eff.id}
                onClick={() => onChange({ mouseEffect: eff.id as MouseEffectType })}
                className={`py-1.5 px-2 text-[10px] text-center rounded-lg border transition-all ${
                  params.mouseEffect === eff.id
                    ? 'bg-pink-500/10 border-pink-500/40 text-pink-300'
                    : 'bg-black/35 border-white/5 text-gray-400 hover:bg-white/5'
                }`}
                id={`mouse-effect-${eff.id}`}
              >
                {eff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Picking and Theme Palette */}
        <div>
          <label className="text-xs font-mono font-medium text-gray-300 block mb-2">Color Palette Accent</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => onChange({ color: c.value })}
                className={`w-7 h-7 rounded-full border relative transition-all ${
                  params.color === c.value 
                    ? 'ring-2 ring-pink-400 border-white ring-offset-2 ring-offset-[#12121a] scale-110' 
                    : 'border-white/10 hover:scale-105'
                }`}
                style={{
                  background: c.value === 'rainbow' 
                    ? 'linear-gradient(135deg, #ff007f, #3b82f6, #10b981, #f59e0b)' 
                    : c.value
                }}
                title={c.name}
                id={`color-preset-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
              />
            ))}
            
            {/* Custom Color Picker Option */}
            <div className="relative flex items-center gap-1.5">
              <button
                onClick={() => onChange({ color: 'custom' })}
                className={`w-7 h-7 rounded-full border border-white/10 flex items-center justify-center bg-gray-800 transition-all ${
                  params.color === 'custom' 
                    ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-[#12121a] scale-110' 
                    : 'hover:scale-105'
                }`}
                title="Custom Color Pick"
                id="color-custom"
              >
                <Pipette className="w-3.5 h-3.5 text-gray-300" />
              </button>
              
              {params.color === 'custom' && (
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-lg px-2 py-0.5 font-mono text-[11px]">
                  <input
                    type="color"
                    value={params.customColor}
                    onChange={(e) => onChange({ customColor: e.target.value })}
                    className="w-5 h-5 bg-transparent border-0 rounded cursor-pointer"
                    id="custom-color-picker-input"
                  />
                  <span className="text-gray-400 select-all uppercase">{params.customColor}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Glow Shadow & Vector Connections Line Checkbox */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id="glow-shadow-checkbox"
            checked={params.glowEffect}
            onChange={(e) => onChange({ glowEffect: e.target.checked })}
            className="w-4 h-4 text-pink-500 bg-black/40 border-gray-800 rounded focus:ring-pink-500 focus:ring-offset-[#12121a] focus:ring-2"
          />
          <label htmlFor="glow-shadow-checkbox" className="text-xs font-mono text-gray-300 select-none cursor-pointer">
            Aura Glow & Connected Particle Webs
          </label>
        </div>
      </div>
    </div>
  );
}
