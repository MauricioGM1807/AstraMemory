/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundProps {
  reducedMotion?: boolean;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ reducedMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate multi-depth star layers
    const numStars = Math.min(120, Math.floor((width * height) / 10000));
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      speedY: Math.random() * 0.15 + 0.05,
      hue: Math.random() > 0.7 ? (Math.random() > 0.5 ? 190 : 270) : 210, // Blue, cyan, or purple tint
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGradient.addColorStop(0, '#0a0f1d');
      bgGradient.addColorStop(0.5, '#050814');
      bgGradient.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric nebula clouds
      const nebula = ctx.createRadialGradient(
        width * 0.2,
        height * 0.25,
        0,
        width * 0.2,
        height * 0.25,
        width * 0.4
      );
      nebula.addColorStop(0, 'rgba(14, 165, 233, 0.04)');
      nebula.addColorStop(0.6, 'rgba(99, 102, 241, 0.02)');
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!reducedMotion) {
          s.alpha += s.twinkleSpeed;
          if (s.alpha > 0.95 || s.alpha < 0.15) {
            s.twinkleSpeed = -s.twinkleSpeed;
          }
          s.y -= s.speedY;
          if (s.y < 0) {
            s.y = height;
            s.x = Math.random() * width;
          }
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 75%, ${s.alpha})`;
        ctx.shadowBlur = s.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = `hsla(${s.hue}, 90%, 65%, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      aria-hidden="true"
    />
  );
};
