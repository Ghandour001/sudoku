import { useEffect, useState } from "react";

function useTimer(initialSeconds = 0, isRunning = false) {
  const [seconds, setSeconds] = useState(() => {
    const value = Number(initialSeconds);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  });

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning]);

  const reset = () => {
    setSeconds(0);
  };

  const setTime = (value) => {
    const numericValue = Number(value);

    setSeconds(
      Number.isFinite(numericValue)
        ? Math.max(0, Math.floor(numericValue))
        : 0,
    );
  };

  return {
    seconds,
    reset,
    setTime,
  };
}

export default useTimer;