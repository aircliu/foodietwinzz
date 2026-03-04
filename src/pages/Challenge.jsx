import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LiveFollowerCount from "../components/LiveFollowerCount";
import useInstagramLive from "../hooks/useInstagramLive";
import { milestones, getMilestoneStatus, getFilmedCount, getSpentSoFar, TOTAL_BUDGET } from "../data/milestones";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function MilestoneRow({ data, index, visible, status, justFilmed }) {
  const [hover, setHover] = useState(false);
  const isFilmed = status === "filmed";
  const isNext = status === "next";
  const isLocked = status === "locked";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(12px, 3vw, 24px)",
        padding: "24px 28px",
        borderRadius: 14,
        background: justFilmed
          ? "linear-gradient(135deg, rgba(45,216,129,0.08), var(--surface-2))"
          : isNext
          ? "linear-gradient(135deg, var(--surface-2), rgba(255,92,53,0.04))"
          : "var(--surface-2)",
        border: `1px solid ${
          justFilmed
            ? "rgba(45,216,129,0.4)"
            : hover
            ? isFilmed ? "rgba(45,216,129,0.3)" : isNext ? "rgba(255,92,53,0.35)" : "rgba(242,237,228,0.12)"
            : "var(--cream-dim)"
        }`,
        borderLeft: isFilmed ? "3px solid var(--green)" : isNext ? "3px solid var(--orange)" : "3px solid transparent",
        transition: "all 0.3s ease",
        transform: visible
          ? justFilmed ? "scale(1.02)" : hover ? "translateY(-2px)" : "translateY(0)"
          : "translateY(20px)",
        opacity: visible ? (isLocked ? 0.5 : 1) : 0,
        transitionDelay: `${index * 0.06}s`,
        boxShadow: justFilmed
          ? "0 0 24px rgba(45,216,129,0.15)"
          : hover ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <span style={{ fontSize: 28, flexShrink: 0, opacity: isLocked ? 0.3 : 1 }}>{data.emoji}</span>

      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px, 4vw, 28px)",
        color: isFilmed ? "var(--green)" : isNext ? "var(--orange)" : "var(--cream-dim)",
        flexShrink: 0, minWidth: 50,
      }}>${data.budget}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: "block", fontFamily: "var(--font-heading)", fontSize: 14,
          fontWeight: 600, color: "var(--cream)", marginBottom: 2,
        }}>{data.spot}</span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--cream-muted)",
        }}>{data.followers} followers</span>
      </div>

      {isFilmed && (
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, textTransform: "uppercase",
          padding: "4px 12px", borderRadius: 20,
          background: "var(--green)", color: "#003D00",
        }}>FILMED ✓</span>
      )}
      {isNext && (
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, textTransform: "uppercase",
          padding: "4px 12px", borderRadius: 20,
          background: "var(--orange)", color: "var(--bg)",
          animation: "badgePulse 2s ease-in-out infinite",
        }}>UP NEXT</span>
      )}
      {isLocked && (
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, textTransform: "uppercase",
          padding: "4px 12px", borderRadius: 20,
          background: "rgba(255,255,255,0.06)", color: "var(--cream-dim)",
          border: "1px dashed var(--cream-dim)",
        }}>🔒 LOCKED</span>
      )}
    </div>
  );
}

export default function Challenge() {
  const [timelineRef, timelineVis] = useReveal(0.08);
  const [ctaRef, ctaVis] = useReveal(0.15);
  const { followers } = useInstagramLive(60000);

  // Track previous statuses for celebration animation
  const prevStatusesRef = useRef({});
  const [justFilmedSet, setJustFilmedSet] = useState(new Set());

  const filmed = getFilmedCount(followers);
  const spent = getSpentSoFar(followers);

  // Detect newly filmed milestones
  useEffect(() => {
    if (!followers) return;
    const newJustFilmed = new Set();
    milestones.forEach(m => {
      const status = getMilestoneStatus(m, followers);
      const prev = prevStatusesRef.current[m.threshold];
      if (prev && prev !== "filmed" && status === "filmed") {
        newJustFilmed.add(m.threshold);
      }
      prevStatusesRef.current[m.threshold] = status;
    });
    if (newJustFilmed.size > 0) {
      setJustFilmedSet(newJustFilmed);
      setTimeout(() => setJustFilmedSet(new Set()), 2000);
    }
  }, [followers]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{`
        @keyframes badgePulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
      `}</style>

      {/* Header */}
      <div style={{ paddingTop: 120, paddingBottom: 40, paddingLeft: "clamp(20px, 5vw, 60px)", paddingRight: "clamp(20px, 5vw, 60px)", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1, background: "var(--orange)" }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3,
            color: "var(--orange)",
          }}>MILESTONE TRACKER</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 8vw, 72px)",
          color: "var(--cream)",
          margin: "0 0 16px",
          letterSpacing: 2,
          lineHeight: 1,
        }}>THE CHALLENGE</h1>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.6,
          color: "var(--cream-muted)",
          margin: "0 0 32px",
          maxWidth: 500,
        }}>
          $1 for every 100 followers. Each milestone unlocks a new restaurant.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{
            flex: 1, minWidth: 140,
            background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
            borderRadius: 12, padding: "20px 24px", textAlign: "center",
          }}>
            <LiveFollowerCount compact style={{}} />
          </div>
          <div style={{
            flex: 1, minWidth: 140,
            background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
            borderRadius: 12, padding: "20px 28px", textAlign: "center",
          }}>
            <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cream)", lineHeight: 1.1 }}>
              {filmed}/{milestones.length}
            </span>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--orange)", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>
              FILMED
            </span>
          </div>
          <div style={{
            flex: 1, minWidth: 140,
            background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
            borderRadius: 12, padding: "20px 28px", textAlign: "center",
          }}>
            <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cream)", lineHeight: 1.1 }}>
              ${spent}
            </span>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cream-muted)", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>
              SPENT SO FAR
            </span>
          </div>
          <div style={{
            flex: 1, minWidth: 140,
            background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
            borderRadius: 12, padding: "20px 28px", textAlign: "center",
          }}>
            <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cream)", lineHeight: 1.1 }}>
              ${TOTAL_BUDGET}
            </span>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cream-muted)", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>
              TOTAL IF COMPLETED
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(20px, 5vw, 60px) 8px" }}>
        <div style={{ height: 4, borderRadius: 2, background: "var(--surface-2)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: `${(filmed / milestones.length) * 100}%`,
            background: "var(--gradient-orange)",
            boxShadow: "0 0 12px var(--orange-glow)",
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      </div>

      {/* Milestone rows */}
      <div ref={timelineRef} style={{
        maxWidth: 900, margin: "0 auto",
        padding: "24px clamp(20px, 5vw, 60px) 60px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {milestones.map((m, i) => {
          const status = getMilestoneStatus(m, followers);
          return (
            <MilestoneRow
              key={m.threshold}
              data={m}
              index={i}
              visible={timelineVis}
              status={status}
              justFilmed={justFilmedSet.has(m.threshold)}
            />
          );
        })}
      </div>

      {/* Suggest a Spot CTA */}
      <div ref={ctaRef} style={{
        maxWidth: 900, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 60px) 100px",
        opacity: ctaVis ? 1 : 0,
        transform: ctaVis ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}>
        <div style={{
          width: 40, height: 3, background: "var(--orange)",
          borderRadius: 2, marginBottom: 20,
        }} />
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 6vw, 44px)",
          color: "var(--cream)",
          margin: "0 0 10px",
          letterSpacing: 2,
          lineHeight: 1,
        }}>KNOW WHERE WE SHOULD EAT?</h2>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 16,
          color: "var(--cream-muted)",
          margin: "0 0 28px",
          lineHeight: 1.6,
          maxWidth: 460,
        }}>
          Help us pick the next spot. Drop a suggestion and we might pull up.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            to="/community"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "18px 28px", borderRadius: 14, textDecoration: "none",
              background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
              transition: "all 0.3s ease", flex: "1 1 240px",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(242,237,228,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(255,92,53,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
          >
            <span style={{ fontSize: 24 }}>🍽️</span>
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, letterSpacing: 1, color: "var(--cream)" }}>SUGGEST A SPOT</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-muted)" }}>Tell us your hidden gem</span>
            </div>
          </Link>
          <Link
            to="/community"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "18px 28px", borderRadius: 14, textDecoration: "none",
              background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
              transition: "all 0.3s ease", flex: "1 1 240px",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,184,75,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(232,184,75,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
          >
            <span style={{ fontSize: 24 }}>📍</span>
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, letterSpacing: 1, color: "var(--cream)" }}>VIEW SUGGESTIONS</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-muted)" }}>See what fans are saying</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
