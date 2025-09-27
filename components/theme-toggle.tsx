'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Add haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Create ripple effect
    const button = document.getElementById('theme-toggle-button');
    if (button) {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.className = 'theme-toggle-ripple';
      ripple.style.left = `${rect.left + rect.width / 2}px`;
      ripple.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 1000);
    }
    
    // Toggle theme
    setTheme(theme === 'dark' ? 'light' : 'dark');
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  if (!mounted) {
    return (
      <button
        className="relative w-[72px] h-[36px] rounded-full bg-gradient-to-r from-muted to-muted/80 border border-border/40 transition-all duration-300 opacity-50"
        aria-label="Toggle theme"
        disabled
      >
        <span className="absolute left-[6px] top-[6px] h-[24px] w-[24px] rounded-full bg-gradient-to-br from-background to-background/90 shadow-sm" />
      </button>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <>
      <style jsx global>{`
        @keyframes theme-toggle-ripple {
          from {
            width: 0;
            height: 0;
            opacity: 0.8;
          }
          to {
            width: 100vmax;
            height: 100vmax;
            opacity: 0;
          }
        }
        
        .theme-toggle-ripple {
          position: fixed;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, var(--primary), transparent);
          pointer-events: none;
          z-index: 9999;
          animation: theme-toggle-ripple 1s ease-out forwards;
        }
        
        @keyframes sun-rays {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes moon-glow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(156, 163, 175, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(156, 163, 175, 0.8));
          }
        }
        
        @keyframes star-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      
      <button
        id="theme-toggle-button"
        onClick={handleThemeToggle}
        className={`
          relative w-[72px] h-[36px] rounded-full transition-all duration-500 ease-in-out
          ${isDark 
            ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]' 
            : 'bg-gradient-to-r from-sky-400 to-blue-500 border-sky-300/50 shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]'
          }
          border hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
          ${isAnimating ? 'scale-95' : ''}
        `}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-pressed={isDark}
        role="switch"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {isDark ? (
            <>
              {/* Stars for dark mode */}
              <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="absolute top-3 left-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-2 left-5 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-10 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            </>
          ) : (
            <>
              {/* Clouds for light mode */}
              <div className="absolute top-2 right-4 w-4 h-2 bg-white/40 rounded-full blur-sm" />
              <div className="absolute bottom-2 right-8 w-3 h-1.5 bg-white/30 rounded-full blur-sm" />
            </>
          )}
        </div>
        
        {/* Toggle knob */}
        <span 
          className={`
            absolute top-[4px] h-[28px] w-[28px] rounded-full 
            transition-all duration-500 ease-in-out transform
            ${isDark 
              ? 'translate-x-[38px] bg-gradient-to-br from-gray-200 to-gray-100 shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(0,0,0,0.1)]' 
              : 'translate-x-[4px] bg-gradient-to-br from-yellow-100 to-orange-200 shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.1)]'
            }
            flex items-center justify-center
            ${isAnimating ? 'scale-110' : ''}
          `}
        >
          {/* Icon container with rotation */}
          <div className={`absolute transition-all duration-500 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
            {/* Sun icon */}
            <div className={`absolute transition-all duration-500 ${isDark ? 'opacity-0 scale-50 rotate-180' : 'opacity-100 scale-100 rotate-0'}`}>
              <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              {/* Sun rays animation */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-[-2px] left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-orange-400 rounded-full" />
                <div className="absolute bottom-[-2px] left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-orange-400 rounded-full" />
                <div className="absolute left-[-2px] top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-orange-400 rounded-full" />
                <div className="absolute right-[-2px] top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-orange-400 rounded-full" />
              </div>
            </div>
            
            {/* Moon icon */}
            <div className={`absolute transition-all duration-500 ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-180'}`}>
              <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24" style={{ filter: isDark ? 'drop-shadow(0 0 4px rgba(156, 163, 175, 0.5))' : 'none' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              {/* Moon crater details */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-400/30 rounded-full" />
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-slate-400/20 rounded-full" />
            </div>
          </div>
        </span>
        
        {/* Ambient glow effect */}
        <div 
          className={`
            absolute inset-0 rounded-full transition-opacity duration-500
            ${isDark 
              ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-100' 
              : 'bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-100'
            }
            blur-xl
          `}
        />
      </button>
    </>
  );
}