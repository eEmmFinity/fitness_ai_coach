'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface TimerProps {
  onTimeUpdate?: (seconds: number) => void;
  autoStart?: boolean;
}

export function Timer({ onTimeUpdate, autoStart = false }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          if (onTimeUpdate) {
            onTimeUpdate(newSeconds);
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    if (onTimeUpdate) {
      onTimeUpdate(0);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border">
      <div className="flex items-center gap-2 flex-1">
        <Clock className="h-5 w-5 text-primary" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Workout Duration</span>
          <span className="text-2xl font-bold font-mono text-foreground">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleStartPause}
          variant={isRunning ? 'outline' : 'primary'}
          size="sm"
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={seconds === 0}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
