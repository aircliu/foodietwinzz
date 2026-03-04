import { useState, useEffect, useRef, useCallback } from "react";

export default function useInstagramLive(intervalMs = 60000) {
  const [followers, setFollowers] = useState(null);
  const [formatted, setFormatted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const lastSuccessRef = useRef(null);

  const fetchCount = useCallback(() => {
    fetch("/followers.json?_=" + Date.now())
      .then((r) => r.json())
      .then((d) => {
        if (d.followers !== null && d.followers !== undefined) {
          setFollowers(d.followers);
          setFormatted(d.formatted);
          setLastUpdated(d.lastUpdated);
          setError(null);
          lastSuccessRef.current = Date.now();
        } else {
          setError("No follower data");
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Fetch on mount + every intervalMs
  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, intervalMs);
    return () => clearInterval(id);
  }, [fetchCount, intervalMs]);

  // Tick "seconds ago" every second
  useEffect(() => {
    const id = setInterval(() => {
      if (lastSuccessRef.current) {
        setSecondsAgo(Math.floor((Date.now() - lastSuccessRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return { followers, formatted, loading, error, lastUpdated, secondsAgo };
}
