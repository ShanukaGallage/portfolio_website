import { useState, useEffect } from "react";

interface GithubStats {
  commits: number;
}

export function useGithubStats() {
  const [stats, setStats] = useState<GithubStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/github-stats");
        if (!response.ok) {
          console.warn(`GitHub stats fetch failed with status: ${response.status}`);
          setStats(null);
          return;
        }
        const data = await response.json();
        setStats({ commits: data.commits });
      } catch (error) {
        console.error("Failed to fetch github stats:", error);
        setStats(null); // Explicitly null on failure
      }
    };

    fetchStats();
  }, []);

  return stats;
}
