import { useState, useEffect } from "react";

export function useLiveClock() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    // Initial update
    const updateTime = () => {
      const now = new Date();
      // toISOString returns e.g. "2026-08-16T11:42:07.123Z"
      const timePart = now.toISOString().split("T")[1].substring(0, 8);
      setTimeStr(`UTC ${timePart}`);
    };
    
    updateTime();
    
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return timeStr;
}
