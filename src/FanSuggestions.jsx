import { useState, useEffect, useRef } from "react";

export default function FanSuggestions() {
  const [name, setName] = useState("");
  const [why, setWhy] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !why.trim() || !tiktok.trim()) return;

    const url = "https://docs.google.com/forms/d/e/1FAIpQLSc9DiMavGKY3hko6zfVGB74TibWgT2oVrKCnC4VWOREHPoSKg/formResponse?"
      + `entry.1158994347=${encodeURIComponent(name)}`
      + `&entry.625321071=${encodeURIComponent(why)}`
      + `&entry.441535905=${encodeURIComponent(tiktok)}`
      + "&submit=Submit";

    // Debug — check browser console to confirm this fires
    console.log("Submitting to Google Forms:", { name, why, tiktok, url });

    // Use an image beacon — most reliable cross-origin method
    const img = new Image();
    img.onerror = () => console.log("Google Form submitted (onerror is normal for image beacon)");
    img.src = url;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setWhy("");
      setTiktok("");
    }, 3000);
  };

  const inputBase = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 14,
    fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box",
  };

  const inputFocused = {
    borderColor: "rgba(255,171,0,0.5)",
    boxShadow: "0 0 16px rgba(255,109,0,0.15)",
  };

  return (
    <section
      ref={sectionRef}
      style={{
        marginTop: 48,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(26px,6vw,36px)",
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 8px",
          letterSpacing: -0.5,
        }}>
          <span role="img" aria-label="plate">🍽️</span> Suggest a Spot
        </h2>
        <p style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.4)",
          margin: 0,
          fontWeight: 500,
        }}>
          Know a hidden gem in Anaheim? Tell us where to eat next.
        </p>
      </div>

      {/* Glassmorphism Card */}
      <div style={{
        padding: "28px 24px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}>
        {submitted ? (
          <div style={{
            textAlign: "center",
            padding: "32px 16px",
            animation: "fadeIn 0.4s ease-out",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12, animation: "successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both" }}>
              <span role="img" aria-label="fire">🔥</span>
            </div>
            <p style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 6px",
            }}>
              Submitted! We might pull up.
            </p>
            <p style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
            }}>
              Thanks for the rec — stay tuned.
            </p>
            {/* Confetti dots */}
            <div style={{ position: "relative", height: 0 }}>
              {[...Array(8)].map((_, i) => (
                <span key={i} style={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: ["#ff0050", "#00f2ea", "#FFAB00", "#00E676"][i % 4],
                  left: "50%",
                  top: -60,
                  animation: `confetti${i % 4} 0.8s ease-out ${i * 0.05}s both`,
                }} />
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Restaurant Name <span style={{ color: "rgba(255,109,0,0.6)" }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="e.g. Tacos El Fuego"
                required
                style={{
                  ...inputBase,
                  ...(focused === "name" ? inputFocused : {}),
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Why we should go <span style={{ color: "rgba(255,109,0,0.6)" }}>*</span>
              </label>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value.slice(0, 200))}
                onFocus={() => setFocused("why")}
                onBlur={() => setFocused(null)}
                placeholder="Their birria ramen is insane..."
                required
                rows={3}
                style={{
                  ...inputBase,
                  resize: "none",
                  ...(focused === "why" ? inputFocused : {}),
                }}
              />
              <span style={{ display: "block", textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
                {why.length}/200
              </span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Your Instagram @ <span style={{ color: "rgba(255,109,0,0.6)" }}>*</span>
              </label>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                onFocus={() => setFocused("tiktok")}
                onBlur={() => setFocused(null)}
                placeholder="@yourhandle"
                required
                style={{
                  ...inputBase,
                  ...(focused === "tiktok" ? inputFocused : {}),
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: 4,
                padding: "14px 28px",
                borderRadius: 30,
                background: "linear-gradient(135deg, #ff0050, #00f2ea)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                letterSpacing: 0.3,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,0,80,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Submit Suggestion
            </button>
          </form>
        )}
      </div>

      {/* Keyframes for confetti + success pop */}
      <style>{`
        @keyframes successPop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti0 {
          from { transform: translate(0, 0) scale(1); opacity: 1; }
          to { transform: translate(-40px, -50px) scale(0); opacity: 0; }
        }
        @keyframes confetti1 {
          from { transform: translate(0, 0) scale(1); opacity: 1; }
          to { transform: translate(35px, -60px) scale(0); opacity: 0; }
        }
        @keyframes confetti2 {
          from { transform: translate(0, 0) scale(1); opacity: 1; }
          to { transform: translate(-20px, -70px) scale(0); opacity: 0; }
        }
        @keyframes confetti3 {
          from { transform: translate(0, 0) scale(1); opacity: 1; }
          to { transform: translate(50px, -45px) scale(0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
