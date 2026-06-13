import React, { useState } from 'react';
import { HeartParams, FormulaType, MouseEffectType } from './types';
import HeartCanvas from './components/HeartCanvas';
import ControlPanel from './components/ControlPanel';
import MathPanel from './components/MathPanel';
import { Heart, Activity, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Initial states set to Victor's exact parameters requested in the prompt
  const [params, setParams] = useState<HeartParams>({
    formula: 'user', // Victor's user formula
    bpm: 72,
    particleCount: 1800,
    color: '#EEAEEE', // Victor's color "#EEAEEE"
    customColor: '#ff2e63',
    size: 1.6,
    scatterBeta: 0.15, // Victor's beta=0.15
    glowEffect: true,
    soundEnabled: false,
    gravity: 0,
    mouseEffect: 'gravitate',
    customParamX1: 17,
    customParamY1: 16,
    customParamY2: 5,
    customParamY3: 3,
    customParamY4: 1
  });

  const updateParams = (updates: Partial<HeartParams>) => {
    setParams(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-gray-100 flex flex-col justify-between selection:bg-pink-500/35 relative overflow-x-hidden" id="app-root-container">
      
      {/* Decorative stars / abstract elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-900/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Primary Header */}
      <header className="border-b border-gray-900/50 bg-[#0a0a0e]/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6" id="app-navigation-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand / Human Labels */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/35 rounded-xl flex items-center justify-center">
                <Heart className="w-5.5 h-5.5 text-pink-400 fill-pink-400/20 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
            </div>
            
            <div className="text-left">
              <h1 className="text-md font-mono font-medium tracking-tight text-white flex items-center gap-2">
                数学爱心方程式心跳动画
                <span className="text-[10px] font-normal text-gray-500 bg-gray-800/60 border border-white/5 px-1.5 py-0.5 rounded uppercase">
                  v1.2
                </span>
              </h1>
              <p className="text-[11px] text-gray-400 font-sans">
                Victor’s Mathematical Heartbeat Equation & Live Particle Simulation
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 font-mono text-[11px] text-gray-400 select-none">
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              <span>DYNAMIC BEATS: <strong className="text-white">{params.bpm} BPM</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>REACTIVE FORCE: <strong className="text-white">SPRINGS</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6" id="app-main-content">
        
        {/* Intro Alert */}
        <div className="bg-gradient-to-r from-pink-500/5 to-purple-500/5 border border-pink-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="flex gap-3 items-start">
            <Info className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-white font-mono font-semibold">
                基于参数回归方程的爱心动力学模拟
              </p>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed mt-0.5 max-w-2xl">
                本程序完美复现并优化了您提供的 Python + Tkinter 爱心数学方程式。您可以在左侧面板直观地体验粒子在弹簧拉力和重力作用下的呼吸与波动，在右侧面板随时修改系数，亦可在底部直接复制适配您最新配置的 Python 源程序脚本。
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => updateParams({ soundEnabled: true })}
              className={`text-xs font-mono font-medium py-1.5 px-3 rounded-lg border transition-all ${
                params.soundEnabled 
                  ? 'bg-transparent border-transparent text-pink-400' 
                  : 'bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-500/20'
              }`}
              id="quick-start-ambient-sound-btn"
            >
              {params.soundEnabled ? '🔊 Sound Active' : '⚡ Enable Heart Synth Sound'}
            </button>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Living Heartbeat Canvas (Renders 7 / 12) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <div className="h-full flex flex-col">
              <HeartCanvas params={params} />
            </div>
          </div>

          {/* Right Column: Interaction Controls (Renders 5 / 12) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <ControlPanel params={params} onChange={updateParams} />
          </div>

        </div>

        {/* Footer Math Panel Explanation */}
        <div className="w-full">
          <MathPanel params={params} />
        </div>

      </main>

      {/* Page Footer */}
      <footer className="border-t border-gray-900 bg-[#0a0a0e]/50 py-6 px-6 text-center text-xs font-mono text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto w-full" id="app-footer-brand">
        <span>
          Mathematical Formula Heartbeat Animation © 2026. Made with Google AI Studio.
        </span>
        <div className="flex gap-4">
          <a href="#settings-control-panel" className="hover:text-pink-400 transition-colors">Parameters</a>
          <span className="text-gray-800">|</span>
          <a href="#mathematical-explanations-panel" className="hover:text-pink-400 transition-colors">Python Code Export</a>
        </div>
      </footer>

    </div>
  );
}
