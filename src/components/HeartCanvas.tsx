import React, { useRef, useEffect, useState } from 'react';
import { HeartParams, Particle, InteractiveRipple, FormulaType } from '../types';
import { synther } from '../utils/audio';

interface HeartCanvasProps {
  params: HeartParams;
}

export default function HeartCanvas({ params }: HeartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<InteractiveRipple[]>([]);
  const lastStateRef = useRef<string>(''); // For tracking changes to rebuild/morph
  
  // Keep track of audio playing
  const audioIndexRef = useRef<number>(0);
  const playTriggeredLub = useRef<boolean>(false);
  const playTriggeredDub = useRef<boolean>(false);

  // Mouse tracking
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  // Canvas size state (just for stats display if needed)
  const [dimensions, setDimensions] = useState({ width: 840, height: 600 });

  // Update mouse position ref
  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  // Equations helper
  function getHeartPoint(t: number, type: FormulaType, cX1: number, cY1: number, cY2: number, cY3: number, cY4: number): { x: number; y: number } {
    let x = 0;
    let y = 0;

    switch (type) {
      case 'user':
        // Victor/User's equation:
        // x = 17 * (sin(t) ** 3)
        // y = -(16 * cos(t) - 5 * cos(2 * t) - 3 * cos(3 * t))
        x = 17 * Math.pow(Math.sin(t), 3);
        y = -(16 * Math.cos(t) - 5 * Math.cos(2 * t) - 3 * Math.cos(3 * t));
        break;

      case 'standard':
        // Standard mathematical romantic heart:
        // x = 16 * (sin(t) ** 3)
        // y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t))
        x = 16 * Math.pow(Math.sin(t), 3);
        y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        break;

      case 'tall':
        // Elegant Tall Heart
        x = 15 * Math.pow(Math.sin(t), 3);
        y = -(15 * Math.cos(t) - 5 * Math.cos(2 * t) - 2.5 * Math.cos(3 * t) - 1.5 * Math.cos(4 * t));
        break;

      case 'cardioid':
        // Polar Cardioid represented parametrically:
        // r = 1 - sin(t)
        // scale up to align size
        x = 13 * (1 - Math.sin(t)) * Math.cos(t);
        // Offset y to better center the cardioid
        y = -13 * (1 - Math.sin(t)) * Math.sin(t) - 4;
        break;

      case 'custom':
      default:
        // Custom interactive coefficients
        x = cX1 * Math.pow(Math.sin(t), 3);
        y = -(cY1 * Math.cos(t) - cY2 * Math.cos(2 * t) - cY3 * Math.cos(3 * t) - cY4 * Math.cos(4 * t));
        break;
    }

    // Multiply by a factor of 10 to standardise size across systems
    return { x: x * 1.5, y: y * 1.5 };
  }

  // Generate / Morph particles function
  const applyParticlesSetup = (width: number, height: number) => {
    const qty = params.particleCount;
    const currentParticles = particlesRef.current;

    // We split particles: 30% boundary, 55% scatter inside, 15% halo outside
    const boundaryQty = Math.floor(qty * 0.35);
    const scatterQty = Math.floor(qty * 0.50);
    const haloQty = qty - boundaryQty - scatterQty;

    const newTargets: { tx: number; ty: number; zone: 'boundary' | 'scatter' | 'halo' }[] = [];

    // 1. Boundary targets
    for (let i = 0; i < boundaryQty; i++) {
      const t = (i / boundaryQty) * 2 * Math.PI;
      const pt = getHeartPoint(
        t, 
        params.formula, 
        params.customParamX1, 
        params.customParamY1, 
        params.customParamY2, 
        params.customParamY3, 
        params.customParamY4
      );
      newTargets.push({ tx: pt.x, ty: pt.y, zone: 'boundary' });
    }

    // 2. Scatter inside targets (based on user's beta distribution log logic or exponential/power scaling)
    for (let i = 0; i < scatterQty; i++) {
      const t = Math.random() * 2 * Math.PI;
      const pt = getHeartPoint(
        t, 
        params.formula, 
        params.customParamX1, 
        params.customParamY1, 
        params.customParamY2, 
        params.customParamY3, 
        params.customParamY4
      );
      
      // Beta log-based scatter scale factor
      const rx = -params.scatterBeta * Math.log(Math.random());
      const ry = -params.scatterBeta * Math.log(Math.random());
      
      // Guard values
      const scaleX = Math.min(Math.max(rx, 0.05), 0.98);
      const scaleY = Math.min(Math.max(ry, 0.05), 0.98);

      newTargets.push({ 
        tx: pt.x * scaleX, 
        ty: pt.y * scaleY, 
        zone: 'scatter' 
      });
    }

    // 3. Halo glow targets (floating on the immediate exterior)
    for (let i = 0; i < haloQty; i++) {
      const t = Math.random() * 2 * Math.PI;
      const pt = getHeartPoint(
        t, 
        params.formula, 
        params.customParamX1, 
        params.customParamY1, 
        params.customParamY2, 
        params.customParamY3, 
        params.customParamY4
      );
      
      // Slightly larger factor to be on the outside
      const haloScale = 1.02 + Math.random() * 0.22;
      newTargets.push({ 
        tx: pt.x * haloScale, 
        ty: pt.y * haloScale, 
        zone: 'halo' 
      });
    }

    // Morph the existing particles or pad if length mismatch
    const updatedParticles: Particle[] = [];
    const maxLen = Math.max(currentParticles.length, newTargets.length);

    for (let i = 0; i < newTargets.length; i++) {
      const target = newTargets[i];
      const distanceFactor = Math.sqrt(target.tx * target.tx + target.ty * target.ty);

      if (i < currentParticles.length) {
        // Morph existing: update targets and smoothly transition
        const p = currentParticles[i];
        p.targetX = target.tx;
        p.targetY = target.ty;
        p.distanceFactor = distanceFactor;
        updatedParticles.push(p);
      } else {
        // Create new particle
        const tX = width / 2 + target.tx * 11;
        const tY = height / 2 + target.ty * 11;
        
        // Random offset initialized
        const initialX = tX + (Math.random() - 0.5) * 100;
        const initialY = tY + (Math.random() - 0.5) * 100;

        updatedParticles.push({
          x: initialX,
          y: initialY,
          targetX: target.tx,
          targetY: target.ty,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          speed: 0.08 + Math.random() * 0.06,
          alpha: target.zone === 'halo' ? 0.2 + Math.random() * 0.4 : 0.6 + Math.random() * 0.4,
          size: target.zone === 'boundary' 
            ? params.size * (1.1 + Math.random() * 0.3) 
            : target.zone === 'halo' 
              ? params.size * (0.6 + Math.random() * 0.4) 
              : params.size * (0.8 + Math.random() * 0.4),
          hueOffset: Math.random() * 30 - 15,
          distanceFactor
        });
      }
    }

    particlesRef.current = updatedParticles;
  };

  // Track resizing and configurations
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
          setDimensions({ width, height });
          
          // Re-trigger particles positioning using standard scale
          applyParticlesSetup(width, height);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    
    // Initial setup with custom defaults
    const initialWidth = containerRef.current.clientWidth || 840;
    const initialHeight = containerRef.current.clientHeight || 600;
    if (canvasRef.current) {
      canvasRef.current.width = initialWidth;
      canvasRef.current.height = initialHeight;
    }
    applyParticlesSetup(initialWidth, initialHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Sync to formula/visual params updates without reset (Morphing!)
  useEffect(() => {
    const currentStateStr = `${params.formula}_${params.particleCount}_${params.scatterBeta}_${params.customParamX1}_${params.customParamY1}_${params.customParamY2}_${params.customParamY3}`;
    if (lastStateRef.current !== currentStateStr) {
      lastStateRef.current = currentStateStr;
      if (canvasRef.current) {
        applyParticlesSetup(canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [
    params.formula, 
    params.particleCount, 
    params.scatterBeta, 
    params.customParamX1, 
    params.customParamY1, 
    params.customParamY2, 
    params.customParamY3, 
    params.customParamY4
  ]);

  // Main animation effect loop
  useEffect(() => {
    let animationId: number;
    let time = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationId = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const { width, height } = canvas;
      const centerX = width / 2;
      const centerY = height / 2 - 20; // Slightly shifted up for visual balance

      // Draw subtle background fading trail
      ctx.fillStyle = 'rgba(10, 10, 14, 0.18)'; // deep space black
      ctx.fillRect(0, 0, width, height);

      // Web Audio sound sync calculations
      const bpm = params.bpm;
      const beatsPerSecond = bpm / 60;
      time += 0.016; // Approx 60fps incremental time
      
      const cycle = (time * beatsPerSecond) % 1;

      // Double-peak "Lub-Dub" heartbeat math equation scaling
      let beatScale = 1;
      if (cycle < 0.15) {
        // "Lub" Contraction (Peak 1)
        const progress = cycle / 0.15;
        beatScale = 1 - 0.13 * Math.sin(progress * Math.PI);
        
        if (!playTriggeredLub.current) {
          if (params.soundEnabled) {
            synther.playLub();
          }
          playTriggeredLub.current = true;
          playTriggeredDub.current = false;
        }
      } else if (cycle >= 0.15 && cycle < 0.25) {
        // Short expansion bounce
        const progress = (cycle - 0.15) / 0.1;
        beatScale = 1 + 0.04 * Math.sin(progress * Math.PI);
      } else if (cycle >= 0.25 && cycle < 0.40) {
        // "Dub" Contraction (Peak 2)
        const progress = (cycle - 0.25) / 0.15;
        beatScale = 1 - 0.08 * Math.sin(progress * Math.PI);

        if (!playTriggeredDub.current) {
          if (params.soundEnabled) {
            synther.playDub();
          }
          playTriggeredDub.current = true;
        }
      } else {
        // Return to resting state slowly
        const progress = (cycle - 0.40) / 0.60;
        beatScale = 1 + 0.02 * Math.sin(progress * Math.PI * 2);
        
        // Reset sound registers for next beat cycle
        if (cycle > 0.85) {
          playTriggeredLub.current = false;
          playTriggeredDub.current = false;
        }
      }

      // Dynamic scale enlargement depending on canvas sizing
      const optimalEnlarge = Math.min(width, height) / 46;
      const enlarge = optimalEnlarge * (1 + (params.size - 2) * 0.1);

      // Draw connection lines between nearest particles if glow effect is raised high
      if (params.glowEffect && particlesRef.current.length > 0) {
        // We draw beautiful glow lines, but only sample a subset for super fast execution
        ctx.strokeStyle = params.color === 'rainbow' ? 'rgba(238, 174, 238, 0.04)' : `${params.color}09`;
        ctx.lineWidth = 0.5;
        const lineLimit = Math.min(particlesRef.current.length, 120);

        ctx.beginPath();
        for (let i = 0; i < lineLimit; i++) {
          const p1 = particlesRef.current[Math.floor(Math.random() * particlesRef.current.length)];
          const p2 = particlesRef.current[Math.floor(Math.random() * particlesRef.current.length)];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 45) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
        ctx.stroke();
      }

      // Update and Draw Particles
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Target coordinates with heartbeat scaling
        const tX = centerX + p.targetX * enlarge * beatScale;
        const tY = centerY + p.targetY * enlarge * beatScale;

        // Spring stiffness and damping factors
        const dragFactor = 1 - (params.gravity * 0.15);
        const stiffness = 0.05 + (1 - dragFactor) * 0.1;
        const damping = 0.82; // Friction

        // Primary alignment force
        const forceX = (tX - p.x) * stiffness;
        const forceY = (tY - p.y) * stiffness;

        p.vx += forceX;
        p.vy += forceY;

        // Apply global constant gravity/flow force pulling slightly downward/upward
        p.vy += params.gravity * 0.08;

        // Custom Mouse interactions
        if (mouse) {
          const dxMouse = p.x - mouse.x;
          const dyMouse = p.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distMouse < 120) {
            const forceStrength = (120 - distMouse) / 120; // 0 to 1

            if (params.mouseEffect === 'repel') {
              // Push away
              const pushAngle = Math.atan2(dyMouse, dxMouse);
              p.vx += Math.cos(pushAngle) * forceStrength * 1.8;
              p.vy += Math.sin(pushAngle) * forceStrength * 1.8;
            } else if (params.mouseEffect === 'gravitate') {
              // Pull toward mouse
              const pullAngle = Math.atan2(dyMouse, dxMouse);
              p.vx -= Math.cos(pullAngle) * forceStrength * 1.4;
              p.vy -= Math.sin(pullAngle) * forceStrength * 1.4;
            } else if (params.mouseEffect === 'explode') {
              // Add extreme noise jitter
              p.vx += (Math.random() - 0.5) * forceStrength * 5;
              p.vy += (Math.random() - 0.5) * forceStrength * 5;
            }
          }
        }

        // Apply friction
        p.vx *= damping;
        p.vy *= damping;

        // Update coordinates
        p.x += p.vx;
        p.y += p.vy;

        // Establish gorgeous colors
        let pColor = params.color;
        if (pColor === 'rainbow') {
          // Rainbow is cyclic based on coordinates and particle index
          const h = (p.distanceFactor * 1.8 + time * 32 + p.hueOffset) % 360;
          pColor = `hsla(${h}, 90%, 75%, ${p.alpha})`;
        } else if (pColor === 'custom') {
          pColor = params.customColor;
        }

        // Render particle
        ctx.fillStyle = pColor;
        ctx.beginPath();
        
        // Heartbeat pulse slightly enlarges particles
        const dynamicParticleRadius = p.size * (1 + (1 - beatScale) * 0.8);
        ctx.arc(p.x, p.y, Math.max(dynamicParticleRadius, 0.4), 0, Math.PI * 2);
        ctx.fill();

        // Optional Outer Glow Effects
        if (params.glowEffect && i % 4 === 0) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = pColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, dynamicParticleRadius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Update and draw interactive ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.2;
        r.alpha -= 0.012;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw multiple beautiful hearts radiating outward as rings
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = r.alpha;
        
        // Draw miniature heart outlines at click point
        ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.1) {
          // simple parametric heart scaled to ripple size
          const hX = r.x + r.radius * 0.8 * Math.pow(Math.sin(t), 3);
          const hY = r.y - r.radius * 0.8 * (0.8 * Math.cos(t) - 0.3 * Math.cos(2*t) - 0.15 * Math.cos(3*t));
          if (t === 0) {
            ctx.moveTo(hX, hY);
          } else {
            ctx.lineTo(hX, hY);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1.0; // reset
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [params, dimensions]);

  // Click handler on canvas - spawns mini beautiful expanding heart ripples
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Initialize/unlock browser audio API upon first user interaction
    synther.init();

    // Determine colour
    const rippleColor = params.color === 'rainbow' 
      ? `hsla(${Math.random() * 360}, 100%, 75%, 0.9)` 
      : params.color === 'custom' 
        ? params.customColor
        : params.color;

    ripplesRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      radius: 5,
      maxRadius: 80 + Math.random() * 60,
      alpha: 1.0,
      color: rippleColor
    });

    // Induce mini explosion/burst velocities to particles nearby click zone
    particlesRef.current.forEach(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 140) {
        const force = (140 - distance) / 120;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 15;
        p.vy += Math.sin(angle) * force * 15;
      }
    });

    // Play instant heartbeat audio synth for amazing tactile click feedback
    if (params.soundEnabled) {
      synther.playLub();
      setTimeout(() => {
        if (params.soundEnabled) synther.playDub();
      }, 160);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[460px] bg-[#0a0a0e] rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50"
      onMouseMove={(e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }}
      onMouseLeave={() => setMousePos(null)}
      id="heart-canvas-container"
    >
      {/* Absolute Canvas */}
      <canvas 
        ref={canvasRef} 
        id="heartbeat-physics-canvas"
        className="block cursor-crosshair w-full h-full"
        onClick={handleCanvasClick}
      />

      {/* Rhythmic Ambient Glow Background Ring */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div 
          className="w-72 h-72 rounded-full opacity-10 blur-[90px] transition-all duration-300 pointer-events-none"
          style={{
            backgroundColor: params.color === 'rainbow' ? '#EEAEEE' : params.color === 'custom' ? params.customColor : params.color,
            transform: `scale(${1.2 + Math.random() * 0.1})`
          }}
        />
      </div>

      {/* Floating Canvas UI Overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none text-left bg-black/40 backdrop-blur-md border border-white/5 py-2 px-3 rounded-lg text-[11px] font-mono select-none">
        <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] pb-1 border-b border-white/5">Mathematical Engine</span>
        <span className="text-pink-400 mt-1">Status: Active</span>
        <span className="text-gray-300">Particles: {particlesRef.current.length}</span>
        <span className="text-gray-300">BPM: {params.bpm} | Rate: {(params.bpm / 60).toFixed(2)}Hz</span>
        <span className="text-gray-300">Formula: {params.formula.toUpperCase()}</span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
        <p className="text-[11px] text-gray-500 font-mono tracking-widest bg-black/40 backdrop-blur-sm inline-block px-3 py-1 rounded-full border border-white/5 uppercase select-none">
          ✦ Click or tap inside to release heartbeat ripple pulses ✦
        </p>
      </div>
    </div>
  );
}
