'use client';

import React from 'react';

interface FenixLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function FenixLogo({ size = 40, className = '', animate = false }: FenixLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animate ? 'logo-glow' : ''}`}
    >
      {/* Fenix flame/phoenix design */}
      <defs>
        <linearGradient id="fenixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Phoenix/Flame shape */}
      <path
        d="M50 10 C30 20, 20 40, 25 60 C28 45, 35 35, 40 30 C35 40, 30 55, 35 70 C38 55, 45 45, 50 40 C55 45, 62 55, 65 70 C70 55, 65 40, 60 30 C65 35, 72 45, 75 60 C80 40, 70 20, 50 10"
        fill="url(#fenixGradient)"
        filter="url(#glow)"
      />
      
      {/* Center flame core */}
      <ellipse
        cx="50"
        cy="55"
        rx="8"
        ry="12"
        fill="#fff"
        opacity="0.9"
      />
    </svg>
  );
}

export function FenixLoading() {
  return (
    <div className="flex items-center justify-center">
      <FenixLogo size={60} animate={true} className="animate-pulse" />
    </div>
  );
}

// Generate favicon as base64 for dynamic injection
export function generateFaviconSVG() {
  const svgString = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ea580c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="6" fill="url(#grad)"/>
      <path d="M16 5 C10 8, 7 14, 8 20 C9 16, 12 13, 13 11 C12 14, 10 19, 12 23 C13 19, 15 16, 16 14 C17 16, 19 19, 20 23 C22 19, 20 14, 19 11 C20 13, 23 16, 24 20 C25 14, 22 8, 16 5" fill="white" opacity="0.9"/>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
}