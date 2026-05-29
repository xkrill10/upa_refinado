import { useState, useEffect } from 'react';

function computeTimeRemaining(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  const sign = diff < 0 ? '-' : '';
  const abs = Math.abs(diff);
  const minutes = Math.floor(abs / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  return `${sign}${minutes}m ${seconds}s`;
}

/**
 * Hook that returns a formatted time remaining until the given deadline.
 * Updates every second.
 * @param deadline ISO date string representing the SLA deadline.
 * @returns A string like "5m 23s" or "-2m 10s" when overdue.
 */
export function useSlaTimer(deadline: string): string {
  const [timeRemaining, setTimeRemaining] = useState<string>(() => computeTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(computeTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return timeRemaining;
}
