/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ParticleSystemRef {
  triggerMatchExplosion: (x: number, y: number, color?: string) => void;
  triggerVictoryCelebration: () => void;
  triggerScorePopup: (text: string, x: number, y: number, isCombo?: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
}

interface FloatingText {
  text: string;
  x: number;
  y: number;
  alpha: number;
  scale: number;
  color: string;
  vy: number;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  reducedMotion?: boolean;
}

export const ParticleSystem = forwardRef<ParticleSystemRef, ParticleSystemProps>(
  ({ reducedMotion = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const floatingTextsRef = useRef<FloatingText[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      triggerMatchExplosion: (x: number, y: number, color = '#38bdf8') => {
        if (reducedMotion) return;
        const count = 35;
        const newParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 1.5;
          const maxLife = Math.random() * 30 + 35;

          newParticles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 3 + 1.5,
            color,
            alpha: 1,
            life: 0,
            maxLife,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
          });
        }

        particlesRef.current.push(...newParticles);
      },

      triggerVictoryCelebration: () => {
        if (reducedMotion) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const count = 120;
        const colors = ['#38bdf8', '#f59e0b', '#a855f7', '#10b981', '#f43f5e', '#fbbf24'];
        const newParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
          const x = Math.random() * canvas.width;
          const y = canvas.height * (0.3 + Math.random() * 0.4);
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 8 + 3;
          const color = colors[Math.floor(Math.random() * colors.length)];

          newParticles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2, // Slight upward boost
            radius: Math.random() * 3.5 + 2,
            color,
            alpha: 1,
            life: 0,
            maxLife: Math.random() * 50 + 60,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.3,
          });
        }

        particlesRef.current.push(...newParticles);
      },

      triggerScorePopup: (text: string, x: number, y: number, isCombo = false) => {
        floatingTextsRef.current.push({
          text,
          x,
          y,
          alpha: 1,
          scale: isCombo ? 1.4 : 1,
          color: isCombo ? '#fbbf24' : '#38bdf8',
          vy: -2,
          life: 0,
          maxLife: 45,
        });
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        if (!canvas) return;
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96; // drag
          p.vy *= 0.96;
          p.vy += 0.08; // subtle cosmic gravity
          p.rotation += p.vRot;
          p.alpha = 1 - p.life / p.maxLife;

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;

          // Star/spark diamond shape
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Update and draw floating score texts
        const texts = floatingTextsRef.current;
        for (let i = texts.length - 1; i >= 0; i--) {
          const t = texts[i];
          t.life++;
          t.y += t.vy;
          t.vy *= 0.97;
          t.alpha = 1 - t.life / t.maxLife;

          if (t.life >= t.maxLife) {
            texts.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, t.alpha);
          ctx.font = `bold ${Math.round(18 * t.scale)}px 'Outfit', sans-serif`;
          ctx.fillStyle = t.color;
          ctx.textAlign = 'center';
          ctx.shadowBlur = 10;
          ctx.shadowColor = t.color;
          ctx.fillText(t.text, t.x, t.y);
          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(loop);
      };

      loop();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-40 w-full h-full"
        aria-hidden="true"
      />
    );
  }
);

ParticleSystem.displayName = 'ParticleSystem';
