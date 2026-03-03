import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import LiveFollowerCount from "../components/LiveFollowerCount";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, style, delay = 0, visible }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [featRef, featVis] = useReveal(0.15);
  const [ctaRef, ctaVis] = useReveal(0.15);

  useEffect(() => { setHeroLoaded(true); }, []);

  return (
    <>
      {/* ===== HERO ===== */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px 40px",
        background: "var(--bg)",
        overflow: "hidden",
      }}>
        {/* Gradient layer */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232,97,60,0.06) 0%, transparent 70%)",
        }} />
        {/* Grain texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {/* Photo */}
          <FadeIn visible={heroLoaded} delay={0}>
            <div style={{
              width: 160, height: 160, borderRadius: "50%", overflow: "hidden",
              boxShadow: "0 0 0 3px var(--orange), 0 0 0 8px var(--bg), 0 0 0 10px var(--gold), 0 0 60px rgba(232,97,60,0.15)",
            }}>
              <img src={heroImg} alt="FoodieTwinzz" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn visible={heroLoaded} delay={0.15} style={{ marginTop: 16 }}>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(52px, 10vw, 90px)",
              letterSpacing: 4, color: "var(--cream)", margin: 0, lineHeight: 1,
              textShadow: "0 0 80px rgba(232,97,60,0.2)",
            }}>FOODIETWINZZ</h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn visible={heroLoaded} delay={0.25} style={{ marginTop: 8 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: 4,
              color: "var(--orange)", textTransform: "uppercase", margin: 0,
            }}></p>
          </FadeIn>

          {/* Live follower count */}
          <FadeIn visible={heroLoaded} delay={0.3} style={{ marginTop: 24 }}>
            <LiveFollowerCount />
          </FadeIn>

          {/* Rule pill */}
          <FadeIn visible={heroLoaded} delay={0.35} style={{ marginTop: 28 }}>
            <div style={{
              border: "1px solid var(--orange)", borderRadius: 24, padding: "12px 28px",
              background: "var(--orange-glow)", textAlign: "center",
            }}>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 2,
                color: "var(--orange)",
              }}>$1 FOR EVERY 100 FOLLOWERS</span>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 12, color: "var(--cream-muted)",
                margin: "4px 0 0",
              }}>Finding the best food at every price point</p>
            </div>
          </FadeIn>

          {/* Buttons */}
          <FadeIn visible={heroLoaded} delay={0.45} style={{ marginTop: 28 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="https://www.tiktok.com/@foodietwinzz"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-fill"
                style={{
                  background: "var(--orange)", color: "var(--bg)",
                  fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 2,
                  padding: "14px 32px", borderRadius: 8, textDecoration: "none",
                  border: "none", cursor: "pointer", display: "inline-block",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,97,60,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >WATCH ON TIKTOK</a>
              <a
                href="https://www.instagram.com/foodietwinzz/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
                  color: "#fff",
                  fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 2,
                  padding: "14px 32px", borderRadius: 8, textDecoration: "none",
                  border: "none", cursor: "pointer", display: "inline-block",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.15)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(225,48,108,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >FOLLOW ON INSTAGRAM</a>
            </div>
          </FadeIn>
        </div>

        {/* Scroll chevron */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          animation: "heroChevronBounce 2s ease-in-out infinite",
        }}>
          <div style={{
            width: 12, height: 12, borderRight: "2px solid var(--cream-muted)",
            borderBottom: "2px solid var(--cream-muted)", transform: "rotate(45deg)",
          }} />
        </div>

        <style>{`@keyframes heroChevronBounce { 0%,100%{ transform: translateX(-50%) translateY(0); } 50%{ transform: translateX(-50%) translateY(8px); } }`}</style>
      </section>

      {/* ===== DAY COUNTER ===== */}
      <section ref={featRef} style={{ padding: "100px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{
          textAlign: "center",
          opacity: featVis ? 1 : 0, transform: featVis ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: 3,
            color: "var(--orange)", textTransform: "uppercase",
            display: "inline-flex", alignItems: "center", gap: 10,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "var(--orange)",
              animation: "dayPulse 2s ease-in-out infinite", display: "inline-block",
            }} />
            LIVE CHALLENGE
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 12vw, 100px)",
            color: "var(--cream)",
            margin: "16px 0 8px",
            lineHeight: 1,
            letterSpacing: 2,
          }}>
            WHO'S READY FOR DAY {Math.max(1, Math.floor((Date.now() - new Date("2026-02-28T00:00:00").getTime()) / 86400000))}
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.6,
            color: "var(--cream-muted)", maxWidth: 480, margin: "0 auto 32px",
          }}>
            $1 for every 100 followers. A new restaurant every milestone. Follow the journey.
          </p>
          <Link
            to="/challenge"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 2,
              padding: "14px 32px", borderRadius: 8,
              background: "var(--orange)", color: "var(--bg)",
              textDecoration: "none", transition: "all 0.25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,97,60,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >VIEW THE CHALLENGE</Link>
        </div>
        <style>{`@keyframes dayPulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }`}</style>
      </section>

      {/* ===== COMMUNITY CTA ===== */}
      <section ref={ctaRef} style={{ padding: "80px 20px" }}>
        <div style={{
          maxWidth: 600, margin: "0 auto", textAlign: "center",
          opacity: ctaVis ? 1 : 0, transform: ctaVis ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 48px)",
            color: "var(--cream)", margin: "0 0 12px", lineHeight: 1, letterSpacing: 1,
          }}>KNOW A HIDDEN GEM?</h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 16, color: "var(--cream-muted)",
            margin: "0 0 32px", lineHeight: 1.6,
          }}>
            Tell us where to eat next. The best suggestions get featured.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/community"
              style={{
                background: "var(--orange)", color: "var(--bg)",
                fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 2,
                padding: "14px 32px", borderRadius: 8, textDecoration: "none",
                transition: "all 0.25s ease", display: "inline-block",
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,97,60,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >SUGGEST A SPOT</Link>
            <Link
              to="/contact"
              style={{
                border: "1px solid var(--gold)", color: "var(--gold)",
                fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 2,
                padding: "14px 32px", borderRadius: 8, textDecoration: "none",
                background: "transparent", transition: "all 0.25s ease", display: "inline-block",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = ""; }}
            >FOR RESTAURANTS</Link>
          </div>
        </div>
      </section>
    </>
  );
}
