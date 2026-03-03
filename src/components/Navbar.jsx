import { useState, useEffect } from "react";

const BURNT_ORANGE = "#E8613C";
const CREAM = "#F5F0E8";
const GOLD = "#D4A853";
const BASE = "#050505";

const NAV_LINKS = [
  { label: "CHALLENGE", href: "#challenge" },
  { label: "MERCH", href: "#merch" },
  { label: "SUGGEST", href: "#suggest" },
  { label: "CONTACT", href: "#contact" },
];

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const styles = {
  nav: (scrolled) => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: "0 clamp(20px, 5vw, 48px)",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: scrolled ? "rgba(5,5,5,0.92)" : "transparent",
    backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
    borderBottom: `1px solid ${scrolled ? BURNT_ORANGE : "transparent"}`,
    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
  }),
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(20px, 5vw, 26px)",
    fontWeight: 400,
    letterSpacing: 4,
    color: CREAM,
    textDecoration: "none",
    lineHeight: 1,
    userSelect: "none",
  },
  desktopLinks: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  link: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    color: "rgba(245,240,232,0.6)",
    textDecoration: "none",
    transition: "color 0.3s ease",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
  hamburger: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 8,
    zIndex: 1001,
  },
  hamburgerLine: (open, index) => {
    const base = {
      width: 24,
      height: 1.5,
      background: CREAM,
      borderRadius: 1,
      transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
      transformOrigin: "center",
    };
    if (open && index === 0) return { ...base, transform: "translateY(6.5px) rotate(45deg)" };
    if (open && index === 1) return { ...base, opacity: 0, transform: "scaleX(0)" };
    if (open && index === 2) return { ...base, transform: "translateY(-6.5px) rotate(-45deg)" };
    return base;
  },
  overlay: (open) => ({
    position: "fixed",
    inset: 0,
    zIndex: 999,
    background: "rgba(5,5,5,0.97)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
  }),
  overlayLink: (index, open) => ({
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(48px, 12vw, 72px)",
    letterSpacing: 6,
    color: CREAM,
    textDecoration: "none",
    padding: "8px 0",
    lineHeight: 1.2,
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.5s ease ${0.1 + index * 0.08}s, transform 0.5s ease ${0.1 + index * 0.08}s`,
    cursor: "pointer",
    background: "none",
    border: "none",
    textAlign: "center",
  }),
  overlayAccent: {
    width: 40,
    height: 2,
    background: BURNT_ORANGE,
    margin: "24px auto 0",
    borderRadius: 1,
  },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{fonts}</style>
      <nav style={styles.nav(scrolled)}>
        <a href="#" style={styles.logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          FOODIETWINZZ
        </a>

        {isMobile ? (
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={styles.hamburgerLine(menuOpen, i)} />
            ))}
          </button>
        ) : (
          <div style={styles.desktopLinks}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                style={styles.link}
                onClick={() => scrollTo(link.href)}
                onMouseEnter={(e) => { e.currentTarget.style.color = BURNT_ORANGE; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,240,232,0.6)"; }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile Overlay */}
      <div style={styles.overlay(menuOpen)}>
        {NAV_LINKS.map((link, i) => (
          <button
            key={link.label}
            style={styles.overlayLink(i, menuOpen)}
            onClick={() => scrollTo(link.href)}
            onMouseEnter={(e) => { e.currentTarget.style.color = BURNT_ORANGE; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = CREAM; }}
          >
            {link.label}
          </button>
        ))}
        <div style={styles.overlayAccent} />
      </div>
    </>
  );
}
