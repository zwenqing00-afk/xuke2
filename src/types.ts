export type FormulaType = 'user' | 'standard' | 'tall' | 'cardioid' | 'custom';

export type MouseEffectType = 'none' | 'gravitate' | 'repel' | 'explode';

export interface HeartParams {
  formula: FormulaType;
  bpm: number;
  particleCount: number;
  color: string;
  customColor: string;
  size: number;
  scatterBeta: number;
  glowEffect: boolean;
  soundEnabled: boolean;
  gravity: number;
  mouseEffect: MouseEffectType;
  // User customized equation values for the custom heart formula
  customParamX1: number; // e.g. 17
  customParamY1: number; // e.g. 16
  customParamY2: number; // e.g. 5
  customParamY3: number; // e.g. 3
  customParamY4: number; // e.g. 1
}

export interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  speed: number;
  alpha: number;
  size: number;
  hueOffset: number; // for colorful effects
  distanceFactor: number; // how far from center
}

export interface InteractiveRipple {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}
