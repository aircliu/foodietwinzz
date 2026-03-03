import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LiveFollowerCount from "../components/LiveFollowerCount";

const milestones = [
  { followers: "0", budget: "$0", status: "filmed", emoji: "🧊", label: "Ice", url: "https://www.instagram.com/p/DVZNnxDEiDY/" },
  { followers: "169", budget: "$1.69", status: "filmed", emoji: "🍜", label: "Ramen", url: "https://www.instagram.com/p/DVbmmbHidJ2/" },
  { followers: "4,000", budget: "$38.68", status: "filmed", emoji: "🍣", label: "$40 Budget Meal" },
  { followers: "5,000", budget: "$50", status: "next", emoji: "❓" },
  { followers: "6,000", budget: "$60", status: "locked", emoji: "❓" },
  { followers: "7,000", budget: "$70", status: "locked", emoji: "❓" },
  { followers: "8,000", budget: "$80", status: "locked", emoji: "❓" },
  { followers: "9,000", budget: "$90", status: "locked", emoji: "❓" },
  { followers: "10,000", budget: "$100", status: "locked", emoji: "❓" },
];

const filmed = milestones.filter(m => m.status === "filmed").length;

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

function MilestoneRow({ data, index, visible }) {
  const [hover, setHover] = useState(false);
  const isFilmed = data.status === "filmed";
  const isNext = data.status === "next";
  const isLocked = data.status === "locked";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(12px, 3vw, 20px)",
        padding: "20px 24px",
        borderRadius: 14,
        background: isNext
          ? "linear-gradient(135deg, var(--surface), rgba(232,97,60,0.04))"
          : "var(--surface)",
        border: `1px solid ${
          hover
            ? isFilmed ? "rgba(0,200,83,0.3)" : isNext ? "rgba(232,97,60,0.35)" : "rgba(245,240,232,0.12)"
            : "var(--cream-dim)"
        }`,
        borderLeft: isFilmed ? "3px solid var(--green)" : isNext ? "3px solid var(--orange)" : undefined,
        transition: "all 0.3s ease",
        transform: visible ? (hover ? "translateY(-2px)" : "translateY(0)") : "translateY(20px)",
        opacity: visible ? (isLocked ? 0.5 : 1) : 0,
        transitionDelay: `${index * 0.06}s`,
        boxShadow: hover ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
      }}
    >
      {/* Emoji */}
      <span style={{ fontSize: 28, flexShrink: 0, opacity: isLocked ? 0.3 : 1 }}>{data.emoji}</span>

      {/* Budget */}
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(22px, 4vw, 28px)",
        color: isFilmed ? "var(--green)" : isNext ? "var(--orange)" : "var(--cream-dim)",
        flexShrink: 0,
        minWidth: 50,
      }}>{data.budget}</span>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {data.label && (
          <span style={{
            display: "block", fontFamily: "var(--font-body)", fontSize: 14,
            fontWeight: 600, color: "var(--cream)", marginBottom: 2,
          }}>{data.label}</span>
        )}
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--cream-muted)",
        }}>{data.followers} followers</span>
      </div>

      {/* Badge */}
      {isFilmed && data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
            letterSpacing: 1.5, textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 20,
            background: "var(--green)", color: "#003D00",
            textDecoration: "none",
            transition: "filter 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.filter = ""; }}
        >WATCH HERE ▶</a>
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

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{`
        @keyframes badgePulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
      `}</style>

      {/* Header */}
      <div style={{ paddingTop: 120, paddingBottom: 40, paddingLeft: 20, paddingRight: 20, maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 8vw, 72px)",
          color: "var(--cream)",
          margin: "0 0 16px",
          letterSpacing: 4,
          lineHeight: 1,
        }}>THE CHALLENGE</h1>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.6,
          color: "rgba(245,240,232,0.6)",
          margin: "0 0 32px",
          maxWidth: 500,
        }}>
          $1 for every 100 followers. Each milestone unlocks a new Anaheim restaurant.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            flex: 1, minWidth: 160,
            background: "var(--surface)", border: "1px solid var(--cream-dim)",
            borderRadius: 12, padding: "20px 24px", textAlign: "center",
          }}>
            <LiveFollowerCount style={{}} />
          </div>
          <div style={{
            flex: 1, minWidth: 160,
            background: "var(--surface)", border: "1px solid var(--cream-dim)",
            borderRadius: 12, padding: "20px 28px", textAlign: "center",
          }}>
            <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cream)", lineHeight: 1.1 }}>
              {filmed}
            </span>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--orange)", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>
              FILMED
            </span>
          </div>
          <div style={{
            flex: 1, minWidth: 160,
            background: "var(--surface)", border: "1px solid var(--cream-dim)",
            borderRadius: 12, padding: "20px 28px", textAlign: "center",
          }}>
            <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cream)", lineHeight: 1.1 }}>
              $40.37
            </span>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--cream-muted)", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>
              SPENT SO FAR
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 8px" }}>
        <div style={{ height: 4, borderRadius: 2, background: "var(--surface)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: `${(filmed / milestones.length) * 100}%`,
            background: "var(--orange)",
            boxShadow: "0 0 12px var(--orange-glow)",
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      </div>

      {/* Milestone rows */}
      <div ref={timelineRef} style={{
        maxWidth: 800, margin: "0 auto",
        padding: "24px 20px 60px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {milestones.map((m, i) => (
          <MilestoneRow key={i} data={m} index={i} visible={timelineVis} />
        ))}
      </div>

      {/* Suggest a Spot CTA */}
      <div ref={ctaRef} style={{
        maxWidth: 800, margin: "0 auto",
        padding: "0 20px 100px",
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
              background: "var(--surface)", border: "1px solid var(--cream-dim)",
              transition: "all 0.3s ease", flex: "1 1 240px",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,240,232,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(232,97,60,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
          >
            <span style={{ fontSize: 24 }}>🍽️</span>
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 1, color: "var(--cream)" }}>SUGGEST A SPOT</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-muted)" }}>Tell us your hidden gem</span>
            </div>
          </Link>
          <Link
            to="/community"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "18px 28px", borderRadius: 14, textDecoration: "none",
              background: "var(--surface)", border: "1px solid var(--cream-dim)",
              transition: "all 0.3s ease", flex: "1 1 240px",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,168,83,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(212,168,83,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
          >
            <span style={{ fontSize: 24 }}>📍</span>
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 1, color: "var(--cream)" }}>VIEW SUGGESTIONS</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-muted)" }}>See what fans are saying</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
