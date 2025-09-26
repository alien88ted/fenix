"use client"

import { cn } from "@/lib/utils"

interface FenixLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "icon" | "text" | "monochrome"
  animate?: boolean
  showStatus?: boolean
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16"
}

export function FenixLogo({
  className,
  size = "md",
  variant = "default",
  animate = false,
  showStatus = false
}: FenixLogoProps) {
  const logoClasses = cn(
    sizeClasses[size],
    animate && "transition-all duration-300 hover:scale-110",
    className
  )

  if (variant === "icon") {
    return (
      <div className={cn(logoClasses, "relative flex items-center justify-center")}>
        {/* Phoenix Bird Icon with Modern Gradient */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="fenixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--primary)/0.8)" />
              <stop offset="100%" stopColor="hsl(var(--primary)/0.6)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Phoenix Wings */}
          <path
            d="M8 25 C 8 20, 12 16, 16 16 C 18 14, 22 12, 26 14 C 28 12, 32 12, 34 16 C 36 18, 34 22, 32 24"
            stroke="url(#fenixGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Phoenix Body */}
          <path
            d="M16 16 C 18 18, 20 22, 20 26 C 20 28, 22 30, 24 30 C 26 30, 28 28, 28 26 C 28 22, 30 18, 32 16"
            stroke="url(#fenixGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Phoenix Head */}
          <circle
            cx="20"
            cy="14"
            r="3"
            fill="url(#fenixGradient)"
            filter="url(#glow)"
          />

          {/* Phoenix Tail Feathers */}
          <path
            d="M20 30 C 18 32, 16 34, 14 36 M20 30 C 20 32, 20 34, 20 36 M20 30 C 22 32, 24 34, 26 36"
            stroke="url(#fenixGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Fire Elements */}
          <path
            d="M12 28 C 10 30, 8 32, 6 34 M28 28 C 30 30, 32 32, 34 34"
            stroke="url(#fenixGradient)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    )
  }

  if (variant === "text") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={sizeClasses[size]}>
          <FenixLogo variant="icon" size={size} />
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
            size === "sm" && "text-sm",
            size === "md" && "text-lg",
            size === "lg" && "text-2xl",
            size === "xl" && "text-4xl"
          )}>
            Fenix
          </span>
          {showStatus && (
            <div className="relative ml-1">
              <div className={cn(
                "bg-success rounded-full",
                size === "sm" && "w-1 h-1",
                size === "md" && "w-1.5 h-1.5",
                size === "lg" && "w-2 h-2",
                size === "xl" && "w-2.5 h-2.5"
              )} />
              <div className={cn(
                "absolute inset-0 bg-success rounded-full animate-ping opacity-75",
                size === "sm" && "w-1 h-1",
                size === "md" && "w-1.5 h-1.5",
                size === "lg" && "w-2 h-2",
                size === "xl" && "w-2.5 h-2.5"
              )} />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (variant === "monochrome") {
    return (
      <div className={cn(logoClasses, "relative flex items-center justify-center")}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          className="w-full h-full"
        >
          <path
            d="M8 25 C 8 20, 12 16, 16 16 C 18 14, 22 12, 26 14 C 28 12, 32 12, 34 16 C 36 18, 34 22, 32 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16 C 18 18, 20 22, 20 26 C 20 28, 22 30, 24 30 C 26 30, 28 28, 28 26 C 28 22, 30 18, 32 16"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="20" cy="14" r="3" fill="currentColor" />
          <path
            d="M20 30 C 18 32, 16 34, 14 36 M20 30 C 20 32, 20 34, 20 36 M20 30 C 22 32, 24 34, 26 36"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>
    )
  }

  // Default variant with text
  return (
    <FenixLogo variant="text" size={size} className={className} animate={animate} />
  )
}

// Animated loading variant
export function FenixLoading({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <FenixLogo variant="icon" className="animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full animate-ping" />
    </div>
  )
}