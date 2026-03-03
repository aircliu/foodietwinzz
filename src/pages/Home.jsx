import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

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

const products = [
  { emoji: "🥢", name: "Signature Chopsticks", price: "$18", tag: "BEST SELLER", tagColor: "var(--orange)" },
  { emoji: "✨", name: "Premium Metal Set", price: "$32", tag: "LIMITED", tagColor: "var(--gold)" },
  { emoji: "🍜", name: "Ramen Bowl Set", price: "$45", tag: "NEW", tagColor: "var(--green)" },
];

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [featRef, featVis] = useReveal(0.15);
  const [merchRef, merchVis] = useReveal(0.1);
  const [ctaRef, ctaVis] = useReveal(0.15);
  const [spotHover, setSpotHover] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

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
              <Link
                to="/shop"
                className="hero-btn-outline"
                style={{
                  border: "1px solid var(--gold)", color: "var(--gold)",
                  fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 2,
                  padding: "14px 32px", borderRadius: 8, textDecoration: "none",
                  background: "transparent", cursor: "pointer", display: "inline-block",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--bg)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = ""; }}
              >SHOP MERCH</Link>
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

      {/* ===== FEATURED SPOT ===== */}
      <section ref={featRef} style={{ padding: "100px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{
          display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap",
          opacity: featVis ? 1 : 0, transform: featVis ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}>
          {/* Left */}
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: "var(--orange)",
                animation: "featPulse 2s ease-in-out infinite", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3,
                color: "var(--orange)", textTransform: "uppercase",
              }}>UP NEXT</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 42px)",
              color: "var(--cream)", margin: "0 0 12px", lineHeight: 1, letterSpacing: 1,
            }}>TACOS LOS CHOLOS</h2>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--cream-muted)", margin: "0 0 18px",
            }}>5,000 Followers — $50 Budget</p>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.6,
              color: "rgba(245,240,232,0.7)", margin: "0 0 28px",
            }}>
              LA Taco Madness Champions. Filet mignon tacos. The famous Cholo Pizza. This is the one.
            </p>
            <Link
              to="/challenge"
              style={{
                fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: 2,
                color: "var(--orange)", textDecoration: "none",
                transition: "text-underline-offset 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.textUnderlineOffset = "6px"; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
            >VIEW ALL MILESTONES →</Link>
          </div>

          {/* Right — card */}
          <div style={{ flex: "1 1 400px", minWidth: 0 }}>
            <div
              onMouseEnter={() => setSpotHover(true)}
              onMouseLeave={() => setSpotHover(false)}
              style={{
                aspectRatio: "4/3", borderRadius: 16, background: "var(--surface)",
                border: `1px solid ${spotHover ? "rgba(232,97,60,0.3)" : "var(--cream-dim)"}`,
                overflow: "hidden", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", position: "relative",
                transition: "all 0.35s ease",
                transform: spotHover ? "translateY(-4px)" : "translateY(0)",
                boxShadow: spotHover ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
              }}
            >
              {/* Glow behind emoji */}
              <div style={{
                position: "absolute", width: 200, height: 200, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(232,97,60,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <span style={{ fontSize: 80, position: "relative", zIndex: 1 }}>🌮</span>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: 28, color: "var(--cream)",
                margin: "16px 0 4px", letterSpacing: 1, position: "relative", zIndex: 1,
              }}>TACOS LOS CHOLOS</p>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--orange)",
                margin: 0, position: "relative", zIndex: 1,
              }}>$50 BUDGET</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes featPulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }`}</style>
      </section>

      {/* ===== MERCH TEASER ===== */}
      <section ref={merchRef} style={{ padding: "100px 20px", background: "var(--surface)" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          opacity: merchVis ? 1 : 0, transform: merchVis ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}>
          {/* Label with lines */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 20, marginBottom: 12,
          }}>
            <div style={{ flex: "0 1 60px", height: 1, background: "var(--gold)", opacity: 0.3 }} />
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: 4,
              color: "var(--gold)",
            }}>THE SHOP</span>
            <div style={{ flex: "0 1 60px", height: 1, background: "var(--gold)", opacity: 0.3 }} />
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 64px)",
            color: "var(--cream)", textAlign: "center", margin: "0 0 48px",
            lineHeight: 1, letterSpacing: 2,
          }}>EAT IN STYLE</h2>

          {/* Product grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}>
            {products.map((p, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "var(--surface-2)", borderRadius: 12,
                  border: `1px solid ${hoveredCard === i ? "rgba(212,168,83,0.3)" : "var(--cream-dim)"}`,
                  padding: "40px 28px", textAlign: "center",
                  transition: "all 0.3s ease",
                  transform: hoveredCard === i ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: hoveredCard === i ? "0 16px 40px rgba(0,0,0,0.25)" : "none",
                }}
              >
                <div style={{ fontSize: 56, marginBottom: 20 }}>{p.emoji}</div>
                <span style={{
                  display: "inline-block",
                  fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2,
                  padding: "4px 14px", borderRadius: 20, marginBottom: 16,
                  background: p.tagColor, color: "var(--bg)",
                }}>{p.tag}</span>
                <h3 style={{
                  fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 600,
                  color: "var(--cream)", margin: "0 0 8px",
                }}>{p.name}</h3>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--gold)", margin: 0,
                }}>{p.price}</p>
              </div>
            ))}
          </div>

          {/* Browse link */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              to="/shop"
              style={{
                fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 2,
                color: "var(--gold)", textDecoration: "none",
                transition: "text-underline-offset 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.textUnderlineOffset = "6px"; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
            >BROWSE ALL MERCH →</Link>
          </div>
        </div>
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
