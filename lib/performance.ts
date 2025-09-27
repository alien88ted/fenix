/**
 * Performance optimization utilities
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Debounce hook for optimizing expensive operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for limiting function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: IntersectionObserverInit & { freezeOnceVisible?: boolean } = {}
) {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return entry;
}

/**
 * Prefetch images for better performance
 */
export function prefetchImages(urls: string[]): void {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && window.requestIdleCallback
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) => setTimeout(cb, 1);

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
  typeof window !== 'undefined' && window.cancelIdleCallback
    ? window.cancelIdleCallback
    : clearTimeout;

/**
 * Optimize animation frame
 */
export function optimizeAnimationFrame(callback: FrameRequestCallback): number {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16); // ~60fps
}

/**
 * Memory-efficient memoization
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  maxCacheSize: number = 10
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);

    // Limit cache size
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch DOM updates for better performance
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
    window.requestAnimationFrame(() => {
      updates.forEach((update) => update());
    });
  } else {
    updates.forEach((update) => update());
  }
}

import * as React from 'react';