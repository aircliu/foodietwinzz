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
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

const HOW_STEPS = [
  { step: "01", title: "WE HIT A MILESTONE", desc: "Every 1,000 new followers unlocks a new restaurant budget", icon: "📈" },
  { step: "02", title: "YOU PICK THE SPOT", desc: "Fans suggest restaurants. We pick the most viral option.", icon: "📍" },
  { step: "03", title: "WE EAT EVERYTHING", desc: "Full menu exploration. Every dollar spent on camera.", icon: "🍽️" },
  { step: "04", title: "YOU WATCH US FEAST", desc: "Unfiltered reviews posted to TikTok and Instagram.", icon: "🎬" },
];

function MerchComingSoon({ visible }) {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailSubmitted(true);
  };

  return (
    <div style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      textAlign: "center",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(48px, 8vw, 72px)",
        color: "var(--cream)",
        margin: "0 0 12px", lineHeight: 0.95, letterSpacing: 2,
      }}>EAT IN STYLE.</h2>
      <p style={{
        fontFamily: "var(--font-body)", fontSize: 16,
        color: "var(--cream-muted)", lineHeight: 1.6,
        margin: "0 auto 40px", maxWidth: 480,
      }}>Official FoodieTwinzz merch dropping soon. Chopsticks, bowls, apparel & more.</p>

      <div style={{
        maxWidth: 700, margin: "0 auto",
        background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
        borderRadius: 20, padding: "48px 40px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {["🥢", "✨", "🍜", "👕", "🧢"].map((e, i) => (
            <span key={i} style={{ fontSize: 36 }}>{e}</span>
          ))}
        </div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: 32,
          color: "var(--cream)", letterSpacing: 4, margin: "0 0 10px",
        }}>COMING SOON</h3>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: 15,
          color: "var(--cream-muted)", margin: "0 0 28px",
        }}>Be the first to know when we drop.</p>

        {emailSubmitted ? (
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700,
            color: "var(--gold)", margin: 0,
          }}>🔔 You're on the list!</p>
        ) : (
          <form onSubmit={handleEmailSubmit} style={{
            display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
          }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Enter your email"
              required
              style={{
                width: 280, background: "var(--bg)",
                border: `1px solid ${emailFocused ? "var(--gold)" : "var(--cream-dim)"}`,
                borderRadius: 8, padding: "14px 16px",
                color: "var(--cream)", fontSize: 14,
                fontFamily: "var(--font-body)", outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: emailFocused ? "0 0 0 3px var(--gold-glow)" : "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "var(--gold)", color: "var(--bg)",
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                letterSpacing: 2, padding: "14px 24px", borderRadius: 8,
                border: "none", cursor: "pointer",
                transition: "all 0.2s ease", textTransform: "uppercase",
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
            >NOTIFY ME</button>
          </form>
        )}
      </div>

      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--cream-dim)", marginTop: 20, letterSpacing: 1,
      }}>We'll announce on TikTok + Instagram first.</p>
    </div>
  );
}

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [howRef, howVis] = useReveal(0.1);
  const [merchRef, merchVis] = useReveal(0.15);
  const [ctaRef, ctaVis] = useReveal(0.15);
  useEffect(() => { setHeroLoaded(true); }, []);

  return (
    <>
      <style>{`
        @keyframes heroChevronBounce { 0%,100%{ transform: translateX(-50%) translateY(0); } 50%{ transform: translateX(-50%) translateY(8px); } }
        .hero-split { display: flex; align-items: center; gap: clamp(32px, 5vw, 64px); max-width: 1200px; margin: 0 auto; width: 100%; }
        .hero-left { flex: 0 1 55%; min-width: 0; }
        .hero-right { flex: 0 1 45%; min-width: 0; }
        .how-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) {
          .hero-split { flex-direction: column-reverse; text-align: center; }
          .hero-left { align-items: center; }
          .hero-right { max-height: 50vh; width: 100%; }
          .how-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .how-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px clamp(20px, 5vw, 60px) 60px",
        background: "var(--bg)", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,92,53,0.04) 0%, transparent 70%)",
        }} />

        <div className="hero-split">
          <div className="hero-left" style={{ display: "flex", flexDirection: "column" }}>
            <FadeIn visible={heroLoaded} delay={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 1, background: "var(--orange)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3, color: "var(--orange)" }}>SoCal</span>
              </div>
            </FadeIn>

            <FadeIn visible={heroLoaded} delay={0.1}>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(64px, 12vw, 120px)",
                color: "var(--cream)", margin: 0, lineHeight: 0.9, letterSpacing: 2,
              }}>FOODIE<br />TWINZZ</h1>
            </FadeIn>

            <FadeIn visible={heroLoaded} delay={0.2} style={{ marginTop: 16 }}>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 18,
                color: "var(--cream)", opacity: 0.5,
                maxWidth: 400, lineHeight: 1.5, margin: 0,
              }}>We eat so you don't have to waste your money.</p>
            </FadeIn>

            <FadeIn visible={heroLoaded} delay={0.3} style={{ marginTop: 32 }}>
              <LiveFollowerCount />
            </FadeIn>

            <FadeIn visible={heroLoaded} delay={0.4} style={{ marginTop: 28 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href="https://www.tiktok.com/@foodietwinzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "var(--orange)", color: "var(--bg)",
                    fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                    letterSpacing: 2, padding: "14px 28px", borderRadius: 8,
                    textDecoration: "none", display: "inline-block",
                    transition: "all 0.25s ease", textTransform: "uppercase",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,92,53,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >WATCH ON TIKTOK</a>
                <a
                  href="https://www.instagram.com/foodietwinzz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "var(--gradient-instagram)", color: "#fff",
                    fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                    letterSpacing: 2, padding: "14px 28px", borderRadius: 8,
                    textDecoration: "none", display: "inline-block",
                    transition: "all 0.25s ease", textTransform: "uppercase",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(225,48,108,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >FOLLOW ON INSTAGRAM</a>
              </div>
            </FadeIn>
          </div>

          <div className="hero-right">
            <FadeIn visible={heroLoaded} delay={0.15}>
              <div style={{ position: "relative" }}>
                <img
                  src={heroImg} alt="FoodieTwinzz" loading="lazy"
                  style={{
                    width: "100%", aspectRatio: "1/1", objectFit: "cover",
                    borderRadius: "50%", position: "relative", zIndex: 1,
                    boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
                  }}
                />
                <div style={{
                  position: "absolute", bottom: -12, right: -8, zIndex: 2,
                  background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
                  borderRadius: 10, padding: "12px 16px",
                  fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cream)",
                  whiteSpace: "nowrap",
                }}>🥢 $1 per 100 followers</div>
              </div>
            </FadeIn>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          animation: "heroChevronBounce 2s ease-in-out infinite",
        }}>
          <div style={{
            width: 12, height: 12, borderRight: "2px solid var(--cream-muted)",
            borderBottom: "2px solid var(--cream-muted)", transform: "rotate(45deg)",
          }} />
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section ref={howRef} style={{
        padding: "100px clamp(20px, 5vw, 60px)",
        background: "var(--surface)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          justifyContent: "center", marginBottom: 48,
          opacity: howVis ? 1 : 0, transform: howVis ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: "var(--cream-dim)" }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 4,
            color: "var(--orange)", textTransform: "uppercase",
          }}>HOW IT WORKS</span>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: "var(--cream-dim)" }} />
        </div>

        <div className="how-grid">
          {HOW_STEPS.map((step, i) => (
            <div
              key={step.step}
              style={{
                background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
                borderRadius: 16, padding: "32px 24px",
                opacity: howVis ? 1 : 0,
                transform: howVis ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s ease-out ${i * 0.1}s, transform 0.5s ease-out ${i * 0.1}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,92,53,0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cream-dim)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: 2, color: "var(--orange)" }}>{step.step}</span>
              <div style={{ fontSize: 40, margin: "16px 0" }}>{step.icon}</div>
              <h3 style={{
                fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700,
                color: "var(--cream)", margin: "0 0 8px", lineHeight: 1.2,
              }}>{step.title}</h3>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 14,
                color: "var(--cream-muted)", lineHeight: 1.5, margin: 0,
              }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== MERCH COMING SOON ===== */}
      <section ref={merchRef} style={{
        padding: "100px clamp(20px, 5vw, 60px)",
        background: "var(--bg)",
      }}>
        <MerchComingSoon visible={merchVis} />
      </section>

      {/* ===== COMMUNITY CTA ===== */}
      <section ref={ctaRef} style={{ padding: "80px clamp(20px, 5vw, 60px)" }}>
        <div style={{
          maxWidth: 600, margin: "0 auto", textAlign: "center",
          opacity: ctaVis ? 1 : 0, transform: ctaVis ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 40px)",
            color: "var(--cream)", margin: "0 0 12px", lineHeight: 1, letterSpacing: 1,
          }}>GOT A SPOT FOR US?</h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 16, color: "var(--cream-muted)",
            margin: "0 0 32px", lineHeight: 1.6,
          }}>The best fan suggestions get featured on our page.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/community"
              style={{
                background: "var(--orange)", color: "var(--bg)",
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                letterSpacing: 2, padding: "14px 32px", borderRadius: 8,
                textDecoration: "none", transition: "all 0.25s ease", display: "inline-block",
                textTransform: "uppercase",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,92,53,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >SUGGEST A SPOT</Link>
            <Link
              to="/contact"
              style={{
                border: "1px solid var(--gold)", color: "var(--gold)",
                fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
                letterSpacing: 2, padding: "14px 32px", borderRadius: 8,
                textDecoration: "none", background: "transparent",
                transition: "all 0.25s ease", display: "inline-block",
                textTransform: "uppercase",
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
