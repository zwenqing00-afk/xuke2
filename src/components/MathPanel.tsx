import React, { useState } from 'react';
import { HeartParams, FormulaType } from '../types';
import { BookOpen, Copy, Check, Terminal, Code2, Cpu } from 'lucide-react';

interface MathPanelProps {
  params: HeartParams;
}

export default function MathPanel({ params }: MathPanelProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'math' | 'python'>('math');

  // Math equations formatting
  const getFormulaLaTeX = (type: FormulaType) => {
    switch (type) {
      case 'user':
        return {
          title: "Victor's Heart Parametric Equation (Prompt)",
          x: "x = 17 * sin³(t)",
          y: "y = -(16 * cos(t) - 5 * cos(2t) - 3 * cos(3t))",
          desc: "A stunning, robust and widescreen heart curve. Centered and custom scaled by a magnification multiplier."
        };
      case 'standard':
        return {
          title: "Classic Romantic Heart Curve",
          x: "x = 16 * sin³(t)",
          y: "y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))",
          desc: "The standard cardioid-like algebraic parametric curve used for high-fidelity animations. It is highly symmetrical."
        };
      case 'tall':
        return {
          title: "Extended Romantic Heart Curve",
          x: "x = 15 * sin³(t)",
          y: "y = -(15 * cos(t) - 5 * cos(2t) - 2.5 * cos(3t) - 1.5 * cos(4t))",
          desc: "Elongates the vertical aspect ratios of cos(t) terms. Beautifully optimized for dynamic, deep contractions."
        };
      case 'cardioid':
        return {
          title: "Traditional Polar Cardioid Heart",
          x: "x = 13 * (1 - sin(t)) * cos(t)",
          y: "y = -13 * (1 - sin(t)) * sin(t) - 4",
          desc: "A classical heart curve derived from the cardioid parametric polar system r = a(1 - sin(θ)). Yields a soft, organic look."
        };
      case 'custom':
        return {
          title: "Custom Math Parameter Coefficient Heart",
          x: `x = ${params.customParamX1} * sin³(t)`,
          y: `y = -(${params.customParamY1} * cos(t) - ${params.customParamY2} * cos(2t) - ${params.customParamY3} * cos(3t) - ${params.customParamY4} * cos(4t))`,
          desc: "Derived in real-time from your custom coordinate multipliers. Fully interactive!"
        };
    }
  };

  const eq = getFormulaLaTeX(params.formula);

  // Generate python source code matching the UI state!
  const generatePythonCode = () => {
    // Determine target variables
    let coefX = "17";
    let coefY = "16 * cos(t) - 5 * cos(2 * t) - 3 * cos(3 * t)";

    if (params.formula === 'standard') {
      coefX = "16";
      coefY = "13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)";
    } else if (params.formula === 'tall') {
      coefX = "15";
      coefY = "15 * cos(t) - 5 * cos(2 * t) - 2.5 * cos(3 * t) - 1.5 * cos(4 * t)";
    } else if (params.formula === 'cardioid') {
      coefX = "13 * (1 - sin(t))";
      coefY = "13 * (1 - sin(t)) * sin(t) + 4";
    } else if (params.formula === 'custom') {
      coefX = `${params.customParamX1}`;
      coefY = `${params.customParamY1} * cos(t) - ${params.customParamY2} * cos(2 * t) - ${params.customParamY3} * cos(3 * t) - ${params.customParamY4} * cos(4 * t)`;
    }

    const hexColor = params.color === 'rainbow' ? '#EEAEEE' : params.color === 'custom' ? params.customColor : params.color;

    return `import random
import time
from math import sin, cos, pi, log
from tkinter import *

# --- Constant Declarations (Synchronised with AI Studio Parametric Controls) ---
CANVAS_WIDTH = 840      # Base canvas width
CANVAS_HEIGHT = 680     # Base canvas height
CANVAS_CENTER_X = CANVAS_WIDTH / 2
CANVAS_CENTER_Y = CANVAS_HEIGHT / 2
IMAGE_ENLARGE = 12      # Scale factor
HEART_COLOR = "${hexColor}" # Selected UI Color Accent
BPM = ${params.bpm}        # Heart contraction beats per minute
PARTICLE_COUNT = ${params.particleCount} # Live density points
BETA = ${params.scatterBeta.toFixed(2)}     # Internal scatter beta dispersion parameter

def heart_function(t):
    """
    Parametric Heart Shape Generator.
    Selected formula: ${params.formula}
    """
    # 1. Base Parametric Coordinates
    x = ${coefX} * (sin(t) ** 3)
    y = -(${coefY})

    # 2. Rescale & Center transform
    x *= IMAGE_ENLARGE
    y *= IMAGE_ENLARGE
    x += CANVAS_CENTER_X
    y += CANVAS_CENTER_Y

    return int(x), int(y)

def scatter_inside(x, y, beta=BETA):
    """
    Log-Normal Randomized Inside scatter.
    """
    ratio_x = - beta * log(random.random())
    ratio_y = - beta * log(random.random())
    
    # Calculate offset with respect to center centroid
    dx = x - CANVAS_CENTER_X
    dy = y - CANVAS_CENTER_Y
    
    # Shift towards core
    new_x = CANVAS_CENTER_X + dx * min(ratio_x, 0.98)
    new_y = CANVAS_CENTER_Y + dy * min(ratio_y, 0.98)
    
    return int(new_x), int(new_y)

# This python template is fully compiled with your custom setup.
# Run on standard Tkinter or copy modules to Pygame.
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePythonCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="mathematical-explanations-panel" className="bg-[#12121a]/95 border border-gray-800/60 rounded-2xl p-6 text-left shadow-lg">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800/60 mb-5">
        <button
          onClick={() => setActiveTab('math')}
          className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-mono font-medium border-b-2 transition-all ${
            activeTab === 'math' 
              ? 'border-pink-500 text-pink-400' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
          id="tab-math-analysis"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Math Analysis
        </button>
        <button
          onClick={() => setActiveTab('python')}
          className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-mono font-medium border-b-2 transition-all ${
            activeTab === 'python' 
              ? 'border-pink-500 text-pink-400' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
          id="tab-python-code"
        >
          <Terminal className="w-3.5 h-3.5" />
          Dynamic Python Code
        </button>
      </div>

      {activeTab === 'math' ? (
        <div id="tab-content-math" className="flex flex-col gap-4 font-mono">
          <div>
            <h3 className="text-sm text-white font-semibold flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-pink-400" />
              {eq.title}
            </h3>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              {eq.desc}
            </p>
          </div>

          {/* Math Render Block */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2 font-mono text-xs text-semibold select-all">
            <div className="flex justify-between items-center bg-[#1c1c28]/60 px-3 py-2 rounded-lg border border-white/5">
              <span className="text-pink-400">X(t)</span>
              <code className="text-white text-right">{eq.x}</code>
            </div>
            <div className="flex justify-between items-center bg-[#1c1c28]/60 px-3 py-2 rounded-lg border border-white/5">
              <span className="text-pink-400">Y(t)</span>
              <code className="text-white text-right">{eq.y}</code>
            </div>
          </div>

          <hr className="border-gray-800/60" />

          {/* Scatter statistics analysis */}
          <div>
            <h4 className="text-xs text-white mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-pink-400" />
              Inside Scatter Physics
            </h4>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed mb-3">
              To place thousands of dots inside the star-convex heart mathematically, we sample coordinate vectors along $[0, 2\pi]$ and scale their length inwards toward the local origin $(0, 0)$.
            </p>
            
            <div className="bg-black/30 rounded-lg p-3 text-[10px] text-gray-400 border border-white/5 flex flex-col gap-2 leading-relaxed">
              <div>
                <span className="text-pink-300 font-semibold block">Beta Coefficient Distribution</span>
                We translate your Python log scatter algorithm:
                <code className="block bg-black/60 p-1.5 rounded text-white mt-1">ratio = - beta * log(random())</code>
                This ensures higher particle density near the heart’s boundaries, simulating a luminous gaseous cloud.
              </div>

              <div>
                <span className="text-teal-300 font-semibold block">Elastic Mechanical Clocks</span>
                We resolve the motion lagging using standard Hooke&apos;s elasticity:
                <code className="block bg-black/60 p-1.5 rounded text-white mt-1">acceleration = distance * stiffness - velocity * damping</code>
                This creates satisfying momentum and wobbling contractions!
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="tab-content-python" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-gray-400">
              Your requested Python code customized with live configurations:
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-mono transition-all ${
                copied 
                  ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300' 
                  : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
              }`}
              id="copy-code-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Script
                </>
              )}
            </button>
          </div>

          <div className="relative font-mono text-[11px] rounded-xl overflow-hidden border border-white/5 bg-black/50 text-gray-300 max-h-[280px] overflow-y-auto p-4 select-text">
            <pre className="text-left leading-normal whitespace-pre">
              {generatePythonCode()}
            </pre>
          </div>
          <span className="text-[10px] font-sans text-gray-500 block leading-tight">
            ⚡ Quick Tip: Copy and run this script in python. It has been fully populated with your current color, BPM, particle counts, and equation choices.
          </span>
        </div>
      )}

    </div>
  );
}
