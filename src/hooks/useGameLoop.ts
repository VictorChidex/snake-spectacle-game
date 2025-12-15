import { useEffect, useRef, useCallback } from 'react';

export function useGameLoop(callback: () => void, speed: number, isRunning: boolean) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const startLoop = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      savedCallback.current();
    }, speed);
  }, [speed]);

  const stopLoop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      stopLoop();
      startLoop();
    } else {
      stopLoop();
    }

    return () => stopLoop();
  }, [isRunning, speed, startLoop, stopLoop]);

  return { startLoop, stopLoop };
}
