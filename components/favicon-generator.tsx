'use client';

import { useEffect } from 'react';

export function FaviconInjector() {
  useEffect(() => {
    // Use the PNG logo file for favicon
    const favicon = '/fenix-logo.png';

    // Update existing favicon links or create new ones
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = favicon;

    // Also set for different favicon types
    const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    if (appleTouchIcon) {
      appleTouchIcon.href = favicon;
    }
  }, []);

  return null;
}