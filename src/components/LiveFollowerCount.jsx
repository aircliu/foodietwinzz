import { useState, useEffect, useRef } from "react";
import useInstagramLive from "../hooks/useInstagramLive";
import { getNextMilestone, getProgressToNext } from "../data/milestones";

const keyframes = `
@keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes loadPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
@keyframes countPop { 0% { transform: scale(1); } 50% { transform: scale(1.06); } 100% { transform: scale(1); } }
`;

function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef(null);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;

    if (from !== to && from !== 0) {
      setPopping(true);
      setTimeout(() => setPopping(false), 300);
    }

    const duration = from === 0 ? 1600 : 800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return (
    <span style={{
      display: "inline-block",
      animation: popping ? "countPop 0.3s ease-out" : "none",
    }}>
      {display.toLocaleString()}
    </span>
  );
}

function formatAgo(seconds) {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  return `${m}m ago`;
}

export default function LiveFollowerCount({ className, style, compact }) {
  const { followers, loading, error, secondsAgo } = useInstagramLive(60000);
  const hasData = followers !== null;

  const nextMs = hasData ? getNextMilestone(followers) : null;
  const progress = hasData ? getProgressToNext(followers) : 0;

  // Compact mode (stats cards)
  if (compact) {
    return (
      <div className={className} style={{ textAlign: "center", ...style }}>
        <style>{keyframes}</style>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          color: "var(--cream)",
          lineHeight: 1.1,
        }}>
          {loading && !hasData ? (
            <span style={{ animation: "loadPulse 1.5s ease-in-out infinite" }}>---</span>
          ) : hasData ? (
            <AnimatedCount value={followers} />
          ) : "—"}
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6,
        }}>
          {hasData && !loading && (
            <span style={{
              width: 5, height: 5, borderRadius: "50%", background: "var(--green)",
              display: "inline-block", animation: "livePulse 2s ease-in-out infinite",
            }} />
          )}
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2,
            color: "var(--orange)", textTransform: "uppercase",
          }}>
            FOLLOWERS
          </span>
        </div>
      </div>
    );
  }

  // Full layout (hero)
  return (
    <div className={className} style={{ ...style }}>
      <style>{keyframes}</style>

      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        flexWrap: "wrap",
      }}>
        {hasData && !loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, alignSelf: "center" }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "var(--green)",
              display: "inline-block", animation: "livePulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
              letterSpacing: 2, color: "var(--green)", textTransform: "uppercase",
            }}>LIVE</span>
          </div>
        )}

        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(40px, 8vw, 48px)",
          color: "var(--cream)",
          lineHeight: 1,
        }}>
          {loading && !hasData ? (
            <span style={{ animation: "loadPulse 1.5s ease-in-out infinite" }}>---</span>
          ) : hasData ? (
            <AnimatedCount value={followers} />
          ) : (
            <span style={{ fontSize: "clamp(20px, 4vw, 28px)" }}>FOLLOW US</span>
          )}
        </div>

        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--cream-muted)", letterSpacing: 1,
        }}>followers</span>
      </div>

      {hasData && (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1,
          color: "var(--cream-dim)", marginTop: 4,
        }}>
          Updated {formatAgo(secondsAgo)}
        </div>
      )}

      {/* Progress bar to next milestone */}
      {hasData && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            width: 200, height: 3, borderRadius: 2, background: "var(--surface-2)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${progress}%`,
              background: "var(--orange)",
              transition: "width 0.8s ease",
            }} />
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1,
            color: "var(--cream-dim)", marginTop: 4,
          }}>
            {nextMs
              ? `NEXT: ${(nextMs.threshold / 1000).toLocaleString()}K — ${nextMs.spot.toUpperCase()}`
              : "ALL MILESTONES COMPLETE 🏆"}
          </div>
        </div>
      )}
    </div>
  );
}
