"use client"

// Favicon Generator Component for Fenix Logo
export function generateFaviconSVG(size: number = 32): string {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fenixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="50%" stop-color="#fb923c" />
      <stop offset="100%" stop-color="#fdba74" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background Circle -->
  <circle cx="20" cy="20" r="18" fill="#ffffff" stroke="url(#fenixGradient)" stroke-width="1"/>

  <!-- Phoenix Wings -->
  <path
    d="M10 24 C 10 20, 13 17, 16 17 C 18 15, 21 13, 24 15 C 26 13, 29 13, 31 16 C 32 18, 31 21, 29 23"
    stroke="url(#fenixGradient)"
    stroke-width="1.5"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Phoenix Body -->
  <path
    d="M16 17 C 18 19, 19 22, 19 25 C 19 27, 21 28, 22 28 C 24 28, 26 27, 26 25 C 26 22, 27 19, 29 17"
    stroke="url(#fenixGradient)"
    stroke-width="2"
    fill="none"
    stroke-linecap="round"
  />

  <!-- Phoenix Head -->
  <circle
    cx="20"
    cy="15"
    r="2.5"
    fill="url(#fenixGradient)"
    filter="url(#glow)"
  />

  <!-- Phoenix Tail -->
  <path
    d="M20 28 C 18 30, 17 32, 16 33 M20 28 C 20 30, 20 32, 20 33 M20 28 C 22 30, 23 32, 24 33"
    stroke="url(#fenixGradient)"
    stroke-width="1.2"
    stroke-linecap="round"
    opacity="0.9"
  />
</svg>
  `.trim()
}

// Generate PNG favicon data URL
export function generateFaviconDataURL(size: number = 32): string {
  const svg = generateFaviconSVG(size)
  const base64 = btoa(svg)
  return `data:image/svg+xml;base64,${base64}`
}

// Component to inject favicon into head
export function FaviconInjector() {
  if (typeof window === 'undefined') return null

  const updateFavicon = () => {
    // Remove existing favicons
    const existingIcons = document.querySelectorAll('link[rel*="icon"]')
    existingIcons.forEach(icon => icon.remove())

    // Add new favicon
    const favicon = document.createElement('link')
    favicon.rel = 'icon'
    favicon.type = 'image/svg+xml'
    favicon.href = generateFaviconDataURL(32)
    document.head.appendChild(favicon)

    // Add Apple touch icon
    const appleTouchIcon = document.createElement('link')
    appleTouchIcon.rel = 'apple-touch-icon'
    appleTouchIcon.sizes = '180x180'
    appleTouchIcon.href = generateFaviconDataURL(180)
    document.head.appendChild(appleTouchIcon)

    // Add Android chrome icons
    const manifestLink = document.createElement('link')
    manifestLink.rel = 'manifest'
    manifestLink.href = '/site.webmanifest'
    document.head.appendChild(manifestLink)
  }

  // Update favicon on mount
  React.useEffect(() => {
    updateFavicon()
  }, [])

  return null
}

// React import for useEffect
import React from 'react'