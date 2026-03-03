import { useState, useEffect, useRef, useCallback } from "react";

const MILESTONES = [4000, 5000, 6000, 7000, 8000, 9000, 10000];
const FALLBACK = 4650;
const REFRESH_MS = 2 * 60 * 1000; // 2 minutes

function getNextMilestone(count) {
  for (const m of MILESTONES) {
    if (count < m) return m;
  }
  return MILESTONES[MILESTONES.length - 1];
}

function getPrevMilestone(count) {
  let prev = 0;
  for (const m of MILESTONES) {
    if (count >= m) prev = m;
    else break;
  }
  return prev;
}

function AnimatedNumber({ value, refreshKey, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    // Always animate: count up from ~90% of value to the full value on refresh
    // On first load, count from 0
    const from = display === 0 ? 0 : Math.round(value * 0.92);
    const to = value;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, refreshKey, duration]);

  return <>{display.toLocaleString()}</>;
}

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function FollowerCounter() {
  const [followers, setFollowers] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [flash, setFlash] = useState(false);
  const ref = useRef(null);

  const fetchCount = useCallback(() => {
    fetch("/api/followers")
      .then((r) => r.json())
      .then((d) => {
        setFollowers(d.followers);
        setRefreshKey((k) => k + 1);
        setFlash(true);
        setTimeout(() => setFlash(false), 1200);
      })
      .catch(() => setFollowers(FALLBACK));
  }, []);

  // Single timer: counts down every second, fetches at zero
  useEffect(() => {
    fetchCount(); // initial load
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          fetchCount();
          return 120;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchCount]);

  // Intersection observer for initial reveal
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const count = followers ?? FALLBACK;
  const next = getNextMilestone(count);
  const prev = getPrevMilestone(count);
  const progress = ((count - prev) / (next - prev)) * 100;
  const remaining = next - count;
  const budget = `$${next / 100}`;

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "0 20px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      <div style={{
        background: "var(--surface)",
        border: `1px solid ${flash ? "var(--green)" : "var(--cream-dim)"}`,
        borderRadius: 20,
        padding: "36px 32px 32px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.4s ease",
      }}>
        {/* Subtle glow */}
        <div style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,97,60,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "counterPulse 2s ease-in-out infinite",
              display: "inline-block",
            }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: "var(--cream-muted)",
              textTransform: "uppercase",
            }}>
              INSTAGRAM FOLLOWERS
            </span>
          </div>
          <a
            href="https://www.instagram.com/foodietwinzz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 1,
              color: "var(--orange)",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            @foodietwinzz
          </a>
        </div>

        {/* Big number */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 12vw, 80px)",
          color: flash ? "var(--green)" : "var(--cream)",
          lineHeight: 1,
          letterSpacing: 2,
          marginBottom: 4,
          transition: "color 0.4s ease",
        }}>
          {visible ? <AnimatedNumber value={count} refreshKey={refreshKey} /> : "0"}
        </div>

        {/* Countdown timer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
          marginBottom: 16,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--cream-dim)",
            letterSpacing: 1,
          }}>
            Next update in
          </span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 700,
            color: countdown <= 10 ? "var(--orange)" : "var(--cream-muted)",
            letterSpacing: 1,
            minWidth: 36,
            transition: "color 0.3s ease",
          }}>
            {formatCountdown(countdown)}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--cream-muted)",
              letterSpacing: 1,
            }}>
              {remaining.toLocaleString()} to go
            </span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--gold)",
              letterSpacing: 1,
            }}>
              {next.toLocaleString()}
            </span>
          </div>

          {/* Bar track */}
          <div style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(245,240,232,0.06)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: visible ? `${Math.min(progress, 100)}%` : "0%",
              borderRadius: 3,
              background: "linear-gradient(90deg, var(--orange), var(--gold))",
              boxShadow: "0 0 12px rgba(232,97,60,0.3)",
              transition: "width 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
          </div>
        </div>

        {/* Next unlock info */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0 0",
          borderTop: "1px solid var(--cream-dim)",
          marginTop: 8,
        }}>
          <div>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 2,
              color: "var(--cream-dim)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 4,
            }}>
              NEXT UNLOCK
            </span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: "var(--cream)",
              letterSpacing: 1,
            }}>
              {next.toLocaleString()} FOLLOWERS
            </span>
          </div>
          <div style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "var(--gold-glow)",
            border: "1px solid rgba(212,168,83,0.2)",
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              color: "var(--gold)",
              letterSpacing: 1,
            }}>
              {budget} BUDGET
            </span>
          </div>
        </div>
      </div>

      <style>{`@keyframes counterPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
