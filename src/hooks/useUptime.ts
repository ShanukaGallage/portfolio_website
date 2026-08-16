import { useState, useEffect } from "react";

export function useUptime(launchDateString: string) {
  const [uptimeStr, setUptimeStr] = useState<string>("");

  useEffect(() => {
    const launchDate = new Date(launchDateString).getTime();

    const updateUptime = () => {
      const now = Date.now();
      const diffMs = now - launchDate;

      if (diffMs < 0) {
        setUptimeStr("UPTIME 0d 0h 0m");
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);

      setUptimeStr(`UPTIME ${days}d ${hours}h ${minutes}m`);
    };

    updateUptime();
    
    // Recalculate every minute
    const intervalId = setInterval(updateUptime, 60000);
    return () => clearInterval(intervalId);
  }, [launchDateString]);

  return uptimeStr;
}
