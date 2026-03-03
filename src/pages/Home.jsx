import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import LiveFollowerCount from "../components/LiveFollowerCount";
import useInstagramLive from "../hooks/useInstagramLive";
import { getNextMilestone } from "../data/milestones";

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

const votingOptions = {
  4000: [
    { id: "musubi-square", emoji: "🍣", name: "Musubi Square", desc: "Wagyu feta taco + spam trio + bulgogi bowl. Sushi taco spread." },
    { id: "bruxie", emoji: "🧇", name: "Bruxie", desc: "Gourmet waffle sandwiches. Fried chicken + sweet combos." },
    { id: "taqueria-de-anda", emoji: "🌯", name: "Taqueria de Anda", desc: "24-hour street tacos. Birria + al pastor at 2am." },
  ],
  5000: [
    { id: "tacos-los-cholos", emoji: "🌮", name: "Tacos Los Cholos", desc: "LA Taco Madness Champs. Filet mignon tacos + Cholo Pizza." },
    { id: "brodard-restaurant", emoji: "🍢", name: "Brodard Restaurant", desc: "Legendary Vietnamese egg rolls. Nem nướng since 1985." },
    { id: "anaheim-white-house", emoji: "🍝", name: "Anaheim White House", desc: "Italian fine dining in a historic 1909 mansion." },
  ],
  6000: [
    { id: "anaheim-packing-house", emoji: "🍜", name: "Anaheim Packing House", desc: "4-vendor food hall crawl. Anti-Gravity Noodles + Dim Sum." },
    { id: "the-ranch", emoji: "🥩", name: "The Ranch Restaurant", desc: "Upscale American. Oak-grilled steaks & craft cocktails." },
    { id: "playground-dtsa", emoji: "🧑‍🍳", name: "Playground DTSA", desc: "Chef's daily menu. No menu — you eat what they make." },
  ],
  7000: [
    { id: "sona-fusion", emoji: "🔥", name: "Sona Fusion Kitchen", desc: "Vietnamese-Peruvian fusion. Truffle fries + lomo saltado." },
    { id: "gabbi-mexican-kitchen", emoji: "🫔", name: "Gabbi's Mexican Kitchen", desc: "Upscale Mexican in Old Towne Orange. Mole flights." },
    { id: "mix-mix-kitchen", emoji: "🍱", name: "Mix Mix Kitchen", desc: "Filipino fusion by a Top Chef alum. Creative tasting menus." },
  ],
  8000: [
    { id: "khan-saab", emoji: "👑", name: "Khan Saab", desc: "Michelin Bib Gourmand. Lamb chops + smoked beef kebab." },
    { id: "tangata", emoji: "🦞", name: "Tángatá", desc: "Inside the Bowers Museum. Upscale brunch & seafood." },
    { id: "the-hobbit", emoji: "🧙", name: "The Hobbit Restaurant", desc: "7-course dinner in a Tolkien-themed cottage. No joke." },
  ],
  9000: [
    { id: "heritage-71-bbq", emoji: "🥩", name: "Heritage 71 BBQ", desc: "Texas-style pit BBQ. Brisket + ribs + pulled pork." },
    { id: "anjins", emoji: "🍖", name: "Anjin", desc: "Japanese BBQ yakiniku. A5 wagyu + premium cuts." },
    { id: "il-barone", emoji: "🍕", name: "Il Barone Ristorante", desc: "Authentic Sicilian Italian. Wood-fired everything." },
  ],
  10000: [
    { id: "wooden-pearl", emoji: "🥂", name: "The Wooden Pearl", desc: "Surf & turf celebration. Premium steak + fresh seafood." },
    { id: "napa-rose", emoji: "🍷", name: "Napa Rose", desc: "Disney Grand Californian fine dining. Wine country cuisine." },
    { id: "the-cellar", emoji: "🕯️", name: "The Cellar Restaurant", desc: "Underground French fine dining since 1969. The $100 splurge." },
  ],
};

function VotingSection({ followers }) {
  const nextMilestone = getNextMilestone(followers);
  const threshold = nextMilestone?.threshold;
  // Fall back to the first available voting options if threshold not in map
  const availableThresholds = Object.keys(votingOptions).map(Number).sort((a, b) => a - b);
  const options = threshold
    ? (votingOptions[threshold] || votingOptions[availableThresholds[0]])
    : votingOptions[availableThresholds[0]];
  const allComplete = !nextMilestone && followers >= 10000;

  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useState(null);

  // Initialize random seed votes once
  useEffect(() => {
    if (options && !votes) {
      const init = {};
      options.forEach(o => { init[o.id] = Math.floor(Math.random() * 50) + 10; });
      setVotes(init);
    }
  }, [options, votes]);

  // Reset when threshold changes
  useEffect(() => {
    setVoted(null);
    setVotes(null);
  }, [threshold]);

  const handleVote = (id) => {
    setVotes(prev => {
      const next = { ...prev };
      if (voted) next[voted] = Math.max(0, next[voted] - 1);
      next[id] = (next[id] || 0) + 1;
      return next;
    });
    setVoted(id);
  };

  if (allComplete) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>🏆</span>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 48px)",
          color: "var(--cream)", margin: "0 0 12px", letterSpacing: 2,
        }}>CHALLENGE COMPLETE</h3>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: 16,
          color: "var(--cream-muted)", margin: 0,
        }}>Every milestone has been conquered. Thanks for riding with us.</p>
      </div>
    );
  }

  // Loading skeleton
  if (!options || !votes) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            background: "var(--surface-2)", border: "1px solid var(--cream-dim)",
            borderRadius: 16, padding: 28, height: 240,
            animation: "skeletonPulse 1.5s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
      }}>
        {options.map(opt => {
          const isVoted = voted === opt.id;
          return (
            <VoteCard
              key={opt.id}
              option={opt}
              isVoted={isVoted}
              voteCount={votes[opt.id] || 0}
              onVote={() => handleVote(opt.id)}
            />
          );
        })}
      </div>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--cream-dim)", textAlign: "center",
        marginTop: 20, letterSpacing: 1,
      }}>
        Results are live. Follow to unlock this milestone.
      </p>
    </>
  );
}

function VoteCard({ option, isVoted, voteCount, onVote }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: isVoted ? "rgba(255,92,53,0.04)" : "var(--surface-2)",
        border: `1px solid ${isVoted ? "rgba(255,92,53,0.4)" : hover ? "rgba(242,237,228,0.15)" : "var(--cream-dim)"}`,
        borderRadius: 16, padding: 28, textAlign: "center",
        cursor: "pointer", transition: "all 0.3s ease",
        transform: hover && !isVoted ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isVoted ? "0 0 24px rgba(255,92,53,0.08)" : hover ? "0 12px 32px rgba(0,0,0,0.2)" : "none",
      }}
      onClick={onVote}
    >
      <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>{option.emoji}</span>
      <h4 style={{
        fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700,
        color: "var(--cream)", margin: "0 0 8px",
      }}>{option.name}</h4>
      <p style={{
        fontFamily: "var(--font-body)", fontSize: 13,
        color: "var(--cream-muted)", margin: "0 0 16px",
        lineHeight: 1.5, minHeight: 40,
      }}>{option.desc}</p>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 12,
        color: "var(--cream-dim)", display: "block", marginBottom: 12,
      }}>{voteCount} votes</span>
      <button
        style={{
          fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
          letterSpacing: 2, textTransform: "uppercase",
          padding: "10px 24px", borderRadius: 8,
          border: isVoted ? "none" : "1px solid var(--orange)",
          color: isVoted ? "var(--bg)" : "var(--orange)",
          background: isVoted ? "var(--orange)" : "transparent",
          cursor: "pointer", transition: "all 0.2s ease",
        }}
        onClick={e => { e.stopPropagation(); onVote(); }}
      >{isVoted ? "VOTED ✓" : "VOTE"}</button>
    </div>
  );
}

function MerchComingSoon({ visible }) {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to Mailchimp or email list
    console.log("Merch email signup:", email);
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
  const [voteRef, voteVis] = useReveal(0.1);
  const [merchRef, merchVis] = useReveal(0.15);
  const [ctaRef, ctaVis] = useReveal(0.15);
  const { followers } = useInstagramLive();

  useEffect(() => { setHeroLoaded(true); }, []);

  return (
    <>
      <style>{`
        @keyframes heroChevronBounce { 0%,100%{ transform: translateX(-50%) translateY(0); } 50%{ transform: translateX(-50%) translateY(8px); } }
        @keyframes skeletonPulse { 0%,100%{ opacity: 0.3; } 50%{ opacity: 0.15; } }
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
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3, color: "var(--orange)" }}>ANAHEIM, CA</span>
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
                <div style={{
                  position: "absolute", top: -20, right: -20, bottom: 20, left: 20,
                  border: "2px solid rgba(255,92,53,0.15)", borderRadius: 20,
                  pointerEvents: "none", zIndex: 0,
                }} />
                <img
                  src={heroImg} alt="FoodieTwinzz"
                  style={{
                    width: "100%", aspectRatio: "4/5", objectFit: "cover",
                    borderRadius: 20, position: "relative", zIndex: 1,
                    transform: "rotate(2deg)",
                    border: "2px solid rgba(242,237,228,0.08)",
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

      {/* ===== CHOOSE OUR NEXT SPOT ===== */}
      <section ref={voteRef} style={{
        padding: "100px clamp(20px, 5vw, 60px)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -20, left: "5%",
          fontFamily: "var(--font-display)", fontSize: "clamp(120px, 20vw, 200px)",
          color: "var(--orange)", opacity: 0.04, lineHeight: 1,
          pointerEvents: "none", userSelect: "none",
        }}>02</div>

        <div style={{
          maxWidth: 1200, margin: "0 auto",
          opacity: voteVis ? 1 : 0, transform: voteVis ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 7vw, 56px)",
            color: "var(--cream)", margin: "0 0 12px", lineHeight: 1, letterSpacing: 2,
          }}>CHOOSE OUR NEXT SPOT</h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 16,
            color: "var(--cream-muted)", margin: "0 0 36px",
            lineHeight: 1.6, maxWidth: 520,
          }}>The next milestone is unlocked by followers — but YOU decide where we eat.</p>

          <VotingSection followers={followers} />

          <Link
            to="/challenge"
            style={{
              display: "inline-block", marginTop: 24,
              fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700,
              color: "var(--orange)", textDecoration: "none",
              letterSpacing: 1, transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.textUnderlineOffset = "6px"; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
          >VIEW ALL MILESTONES →</Link>
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
