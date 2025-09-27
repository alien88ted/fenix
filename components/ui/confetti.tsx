'use client';

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active?: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
}

export function Confetti({
  active = false,
  duration = 3000,
  particleCount = 50,
  spread = 50,
  colors = ['#ea580c', '#fb923c', '#fdba74', '#22c55e', '#3b82f6', '#a855f7']
}: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      
      // Random properties
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const initialX = Math.random() * 100;
      const initialY = -20;
      const finalX = initialX + (Math.random() - 0.5) * spread * 2;
      const finalY = 120;
      const rotateEnd = Math.random() * 720 - 360;
      const delay = Math.random() * 200;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * 0.6}px;
        background: ${color};
        left: ${initialX}%;
        top: ${initialY}%;
        opacity: 0;
        transform: rotate(${Math.random() * 360}deg);
        pointer-events: none;
        z-index: 1000;
      `;

      // Add animation
      particle.animate([
        {
          transform: `translate(0, 0) rotate(0deg) scale(0)`,
          opacity: 0
        },
        {
          transform: `translate(0, 0) rotate(${rotateEnd * 0.3}deg) scale(1)`,
          opacity: 1,
          offset: 0.15
        },
        {
          transform: `translate(${(finalX - initialX) * 0.5}vw, ${(finalY - initialY) * 0.5}vh) rotate(${rotateEnd * 0.7}deg) scale(1)`,
          opacity: 1,
          offset: 0.5
        },
        {
          transform: `translate(${finalX - initialX}vw, ${finalY - initialY}vh) rotate(${rotateEnd}deg) scale(0.5)`,
          opacity: 0
        }
      ], {
        duration: duration,
        delay: delay,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      container.appendChild(particle);
      particles.push(particle);
    }

    // Cleanup
    const cleanup = setTimeout(() => {
      particles.forEach(p => p.remove());
    }, duration + 500);

    return () => {
      clearTimeout(cleanup);
      particles.forEach(p => p.remove());
    };
  }, [active, duration, particleCount, spread, colors]);

  if (!active) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}

// CSS for confetti particles (add to globals.css)
export const confettiStyles = `
  .confetti-particle {
    border-radius: 2px;
    will-change: transform, opacity;
  }
`;