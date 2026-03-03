import { useState, useEffect } from "react";
import heroPhoto from "../assets/hero.png";

const BURNT_ORANGE = "#E8613C";
const CREAM = "#F5F0E8";
const GOLD = "#D4A853";
const BASE = "#050505";

const keyframes = `
  .hero-section { min-height: 100vh; min-height: 100svh; }
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }
  @keyframes ringPulse {
    0%, 100% { box-shadow: 0 0 0 4px ${BURNT_ORANGE}, 0 0 0 8px transparent, 0 0 0 12px ${GOLD}; }
    50% { box-shadow: 0 0 0 4px ${BURNT_ORANGE}, 0 0 0 8px transparent, 0 0 0 12px rgba(212,168,83,0.5); }
  }
  @keyframes grainShift {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2%, -2%); }
    30% { transform: translate(1%, -1%); }
    50% { transform: translate(-1%, 2%); }
    70% { transform: translate(2%, 1%); }
    90% { transform: translate(-2%, 1%); }
  }
`;

const s = {
  section: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: BASE,
    overflow: "hidden",
    padding: "clamp(80px, 15vh, 120px) clamp(16px, 5vw, 24px) clamp(48px, 8vh, 60px)",
    boxSizing: "border-box",
  },
  grain: {
    position: "absolute",
    inset: "-50%",
    width: "200%",
    height: "200%",
    opacity: 0.035,
    pointerEvents: "none",
    zIndex: 1,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundSize: "180px 180px",
    animation: "grainShift 6s steps(6) infinite",
  },
  radialGlow: {
    position: "absolute",
    top: "15%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(600px, 90vw)",
    height: "min(600px, 90vw)",
    borderRadius: "50%",
    background: `radial-gradient(circle, rgba(232,97,60,0.06) 0%, rgba(212,168,83,0.03) 35%, transparent 70%)`,
    pointerEvents: "none",
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
    maxWidth: 700,
    width: "100%",
  },
  photoWrap: {
    width: "min(180px, 40vw)",
    height: "min(180px, 40vw)",
    borderRadius: "50%",
    padding: 0,
    position: "relative",
    marginBottom: "clamp(20px, 4vh, 36px)",
    animation: "heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
  },
  photoRings: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    border: `3px solid ${BURNT_ORANGE}`,
    boxShadow: `0 0 0 7px ${BASE}, 0 0 0 9px ${GOLD}, 0 0 40px rgba(232,97,60,0.15)`,
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(60px, 14vw, 100px)",
    fontWeight: 400,
    color: CREAM,
    letterSpacing: 6,
    lineHeight: 0.95,
    margin: "0 0 clamp(8px, 2vh, 12px)",
    textAlign: "center",
    animation: "heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
  },
  subtitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "clamp(11px, 2.5vw, 14px)",
    fontWeight: 700,
    color: BURNT_ORANGE,
    letterSpacing: "clamp(4px, 1.5vw, 8px)",
    textTransform: "uppercase",
    margin: "0 0 clamp(20px, 4vh, 32px)",
    textAlign: "center",
    animation: "heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both",
  },
  ruleBox: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(10px, 2vw, 14px) clamp(20px, 5vw, 32px)",
    borderRadius: 50,
    border: `1.5px solid ${BURNT_ORANGE}`,
    background: `linear-gradient(135deg, rgba(232,97,60,0.08) 0%, rgba(232,97,60,0.02) 100%)`,
    marginBottom: "clamp(24px, 4vh, 36px)",
    animation: "heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both",
  },
  ruleText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(18px, 4vw, 24px)",
    letterSpacing: 3,
    color: CREAM,
    lineHeight: 1,
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
    animation: "heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both",
  },
  btnFilled: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "clamp(12px, 2vw, 14px) clamp(24px, 5vw, 32px)",
    borderRadius: 50,
    background: BURNT_ORANGE,
    color: "#fff",
    fontFamily: "'Space Mono', monospace",
    fontSize: "clamp(11px, 2.5vw, 12px)",
    fontWeight: 700,
    letterSpacing: 1.5,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
  },
  btnOutline: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "clamp(11px, 2vw, 13px) clamp(24px, 5vw, 32px)",
    borderRadius: 50,
    background: "transparent",
    color: GOLD,
    fontFamily: "'Space Mono', monospace",
    fontSize: "clamp(11px, 2.5vw, 12px)",
    fontWeight: 700,
    letterSpacing: 1.5,
    textDecoration: "none",
    border: `1.5px solid ${GOLD}`,
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease",
  },
  scrollArrow: {
    position: "absolute",
    bottom: 32,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    animation: "heroBounce 2s ease-in-out infinite",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
  scrollLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 3,
    color: "rgba(245,240,232,0.25)",
    textTransform: "uppercase",
  },
  scrollChevron: {
    width: 20,
    height: 20,
    borderRight: "1.5px solid rgba(245,240,232,0.25)",
    borderBottom: "1.5px solid rgba(245,240,232,0.25)",
    transform: "rotate(45deg)",
    marginTop: -4,
  },
};

export default function Hero() {
  const scrollDown = () => {
    const challenge = document.querySelector("#challenge");
    if (challenge) challenge.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="hero-section" style={s.section}>
      <style>{keyframes}</style>

      {/* Grain texture overlay */}
      <div style={s.grain} />

      {/* Radial glow */}
      <div style={s.radialGlow} />

      {/* Content */}
      <div style={s.content}>
        {/* Hero Photo with double ring */}
        <div style={s.photoWrap}>
          <div style={s.photoRings}>
            <img src={heroPhoto} alt="FoodieTwinzz" style={s.photo} />
          </div>
        </div>

        {/* Title */}
        <h1 style={s.title}>FOODIETWINZZ</h1>

        {/* Rule box */}
        <div style={s.ruleBox}>
          <span style={s.ruleText}>$1 FOR EVERY 100 FOLLOWERS</span>
        </div>

        {/* CTA Buttons */}
        <div style={s.buttons}>
          <a
            href="https://www.tiktok.com/@foodietwinzz"
            target="_blank"
            rel="noopener noreferrer"
            style={s.btnFilled}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 6px 28px rgba(232,97,60,0.35)`;
              e.currentTarget.style.background = "#d4562f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = BURNT_ORANGE;
            }}
          >
            WATCH ON TIKTOK
          </a>
          <button
            style={s.btnOutline}
            onClick={() => {
              const el = document.querySelector("#merch");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 6px 28px rgba(212,168,83,0.2)`;
              e.currentTarget.style.background = "rgba(212,168,83,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = GOLD;
            }}
          >
            SHOP MERCH
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button style={s.scrollArrow} onClick={scrollDown} aria-label="Scroll down">
        <span style={s.scrollLabel}>SCROLL</span>
        <span style={s.scrollChevron} />
      </button>
    </section>
  );
}
