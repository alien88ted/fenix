'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative w-16 h-8 rounded-full bg-muted border border-border transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-background shadow-sm" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex items-center justify-center w-14 h-8 rounded-full bg-gradient-to-r from-primary/40 to-primary/60 dark:from-primary/20 dark:to-primary/40 border border-border hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 group touch-manipulation"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
    >
      {/* Track shimmer */}
      <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </span>
      {/* Sliding knob */}
      <span
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-background shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out will-change-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {/* Sun icon */}
        <svg
          className={`h-4 w-4 text-primary transition-all duration-300 ease-in-out ${theme === 'dark' ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        {/* Moon icon */}
        <svg
          className={`absolute h-4 w-4 text-primary transition-all duration-300 ease-in-out ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
