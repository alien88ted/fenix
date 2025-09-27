'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add theme transition handling
  React.useEffect(() => {
    const handleThemeChange = () => {
      // Add transitioning class for smoother theme switches
      document.documentElement.classList.add('theme-transitioning')
      
      // Remove the class after animation completes
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning')
      }, 50)
    }

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const html = mutation.target as HTMLElement
          if (html.classList.contains('dark') || !html.classList.contains('dark')) {
            handleThemeChange()
          }
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="fenix-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}