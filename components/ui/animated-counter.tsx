'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  format,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const previousValue = React.useRef(0);
  const animationRef = React.useRef<number>();
  const startTimestamp = React.useRef<number>();

  React.useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimestamp.current) {
        startTimestamp.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimestamp.current) / duration, 1);
      
      // Use easeOutExpo for smooth animation
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentValue = previousValue.current + (value - previousValue.current) * easeOutExpo;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        previousValue.current = value;
      }
    };

    // Only animate if value changed
    if (previousValue.current !== value) {
      setIsAnimating(true);
      startTimestamp.current = undefined;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  const formattedValue = format
    ? format(displayValue)
    : displayValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <span
      className={cn(
        'inline-block tabular-nums',
        'transition-all duration-200',
        isAnimating && 'scale-105 text-primary',
        className
      )}
    >
      {prefix}
      <span className="font-mono">{formattedValue}</span>
      {suffix}
    </span>
  );
}

interface AnimatedPercentageProps extends Omit<AnimatedCounterProps, 'suffix'> {
  showSign?: boolean;
  colorize?: boolean;
}

export function AnimatedPercentage({
  value,
  showSign = true,
  colorize = true,
  className,
  ...props
}: AnimatedPercentageProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <AnimatedCounter
      value={value}
      decimals={2}
      prefix={showSign && isPositive ? '+' : ''}
      suffix="%"
      className={cn(
        colorize && isPositive && 'text-success',
        colorize && isNegative && 'text-destructive',
        className
      )}
      {...props}
    />
  );
}

interface AnimatedCurrencyProps extends Omit<AnimatedCounterProps, 'prefix' | 'decimals'> {
  currency?: string;
  locale?: string;
}

export function AnimatedCurrency({
  value,
  currency = 'USD',
  locale = 'en-US',
  className,
  ...props
}: AnimatedCurrencyProps) {
  const format = (val: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <AnimatedCounter
      value={value}
      format={format}
      className={className}
      {...props}
    />
  );
}