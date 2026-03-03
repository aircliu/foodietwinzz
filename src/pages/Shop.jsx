import { useState, useEffect } from "react";

export default function Shop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "120px 20px 80px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute",
        width: "min(500px, 80vw)",
        height: "min(500px, 80vw)",
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--gold-glow) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}>
        <span style={{ fontSize: 72, display: "block", marginBottom: 24 }}>🥢</span>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 10vw, 80px)",
          color: "var(--cream)",
          letterSpacing: 4,
          lineHeight: 1,
          margin: "0 0 16px",
        }}>
          MERCH COMING SOON
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          color: "var(--cream-muted)",
          maxWidth: 440,
          margin: "0 auto 12px",
          lineHeight: 1.6,
        }}>
          Branded chopsticks, apparel, and more. Follow us to get first access when we drop.
        </p>

        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--gold)",
          letterSpacing: 2,
          margin: "0 0 40px",
        }}>
          CHOPSTICKS &middot; BOWL SETS &middot; TEES &middot; HOODIES
        </p>

        <a
          href="https://www.instagram.com/foodietwinzz/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-display)",
            fontSize: 15,
            letterSpacing: 2,
            padding: "14px 36px",
            borderRadius: 8,
            border: "1px solid var(--gold)",
            color: "var(--gold)",
            background: "transparent",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = ""; }}
        >
          FOLLOW FOR UPDATES
        </a>
      </div>
    </div>
  );
}
