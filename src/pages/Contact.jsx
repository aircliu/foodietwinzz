import { useState } from "react";
import useInstagramLive from "../hooks/useInstagramLive";
import { getFilmedCount } from "../data/milestones";

const INQUIRY_OPTIONS = ["Get Reviewed", "Book Us for Content", "Sponsorship / Collab", "Other"];

const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const inputBase = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 10,
  border: "1px solid var(--cream-dim)",
  background: "var(--surface)",
  color: "var(--cream)",
  fontSize: 15,
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const inputFocusGold = {
  borderColor: "var(--gold)",
  boxShadow: "0 0 0 3px var(--gold-glow)",
};

const inputError = {
  borderColor: "var(--red)",
};

const labelBase = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--cream-muted)",
  marginBottom: 8,
};

const infoCardBase = {
  background: "var(--surface-2)",
  border: "1px solid var(--cream-dim)",
  borderRadius: 12,
  padding: 28,
  transition: "transform 0.2s ease, border-color 0.2s ease",
};

export default function Contact() {
  const { followers } = useInstagramLive();
  const [form, setForm] = useState({
    restaurantName: "",
    contactName: "",
    email: "",
    phone: "",
    lookingFor: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (field, value) => {
    if (field === "message" && value.length > 500) return;
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    const shake = {};
    if (!form.restaurantName.trim()) { errs.restaurantName = "Required"; shake.restaurantName = true; }
    if (!form.contactName.trim()) { errs.contactName = "Required"; shake.contactName = true; }
    if (!form.email.trim()) {
      errs.email = "Required"; shake.email = true;
    } else if (!form.email.includes("@") || !form.email.includes(".")) {
      errs.email = "Enter a valid email"; shake.email = true;
    }
    if (!form.lookingFor) { errs.lookingFor = "Please select an option"; shake.lookingFor = true; }
    return { errs, shake };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errs, shake } = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShaking(shake);
      setTimeout(() => setShaking({}), 500);
      return;
    }
    const params = new URLSearchParams({
      "entry.74311136": form.restaurantName,
      "entry.879723715": form.contactName,
      "entry.68835238": form.email,
      "entry.1892623605": form.phone,
      "entry.1603563027": form.lookingFor,
      "entry.548184967": form.message,
    });
    new Image().src = `https://docs.google.com/forms/d/e/1FAIpQLSd1uLpNGX7u1nq6kdfzKkwCi--CT_tcT3lQ6025QqukjncmLQ/formResponse?${params}&submit=Submit`;
    setSubmitted(true);
  };

  const reset = () => {
    setForm({ restaurantName: "", contactName: "", email: "", phone: "", lookingFor: "", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{shakeKeyframes}</style>

      {/* Header */}
      <div style={{ paddingTop: 120, paddingBottom: 40, paddingLeft: "clamp(20px, 5vw, 60px)", paddingRight: "clamp(20px, 5vw, 60px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: "var(--gold)" }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3,
              color: "var(--gold)",
            }}>PARTNERSHIPS</span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 72px)",
            color: "var(--cream)",
            letterSpacing: 3,
            lineHeight: 1,
            margin: "0 0 16px",
          }}>
            FOR RESTAURANTS
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            color: "var(--cream-muted)",
            maxWidth: 560,
            lineHeight: 1.6,
          }}>
            Want us to feature your spot? Let's work together.
          </p>
        </div>
      </div>

      {/* Instagram DM Banner */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto 32px",
        padding: "0 clamp(20px, 5vw, 60px)",
      }}>
        <a
          href="https://www.instagram.com/foodietwinzz/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: "20px 28px",
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(255,92,53,0.06), rgba(232,184,75,0.06))",
            border: "1px solid rgba(255,92,53,0.2)",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--orange)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,92,53,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,92,53,0.2)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
        >
          <span style={{ fontSize: 28 }}>📩</span>
          <div style={{ textAlign: "left" }}>
            <p style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(14px, 2.5vw, 18px)",
              fontWeight: 700,
              color: "var(--cream)",
              letterSpacing: 1,
              margin: "0 0 4px",
            }}>
              FASTEST WAY TO REACH US — DM ON INSTAGRAM
            </p>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--orange)",
              margin: 0,
            }}>
              @foodietwinzz
            </p>
          </div>
        </a>
      </div>

      {/* Two-column layout */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 60px) 80px",
        display: "flex",
        gap: 48,
        flexWrap: "wrap",
      }}>
        {/* Left: Form */}
        <div style={{ flex: "1 1 480px", minWidth: 0 }}>
          <div style={{
            background: "var(--surface-2)",
            border: "1px solid rgba(232,184,75,0.12)",
            borderRadius: 16,
            padding: "clamp(28px, 5vw, 40px) clamp(20px, 4vw, 32px)",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease-out" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  color: "var(--cream)",
                  letterSpacing: 3,
                  margin: "0 0 8px",
                }}>
                  WE GOT IT.
                </p>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  color: "var(--cream-muted)",
                  margin: "0 0 32px",
                }}>
                  We'll be in touch within 48 hours.
                </p>
                <button
                  onClick={reset}
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 2,
                    padding: "12px 28px",
                    borderRadius: 10,
                    border: "1px solid var(--gold)",
                    background: "transparent",
                    color: "var(--gold)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-glow)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  SUBMIT ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ animation: shaking.restaurantName ? "shake 0.4s ease" : "none" }}>
                  <label style={labelBase}>
                    RESTAURANT NAME <span style={{ color: "var(--orange)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.restaurantName}
                    onChange={(e) => handleChange("restaurantName", e.target.value)}
                    onFocus={() => setFocused("restaurantName")}
                    onBlur={() => setFocused(null)}
                    placeholder="e.g. Khan Saab"
                    style={{
                      ...inputBase,
                      ...(focused === "restaurantName" ? inputFocusGold : {}),
                      ...(errors.restaurantName ? inputError : {}),
                    }}
                  />
                  {errors.restaurantName && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 6, fontWeight: 500 }}>{errors.restaurantName}</p>}
                </div>

                <div style={{ animation: shaking.contactName ? "shake 0.4s ease" : "none" }}>
                  <label style={labelBase}>
                    CONTACT NAME <span style={{ color: "var(--orange)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                    onFocus={() => setFocused("contactName")}
                    onBlur={() => setFocused(null)}
                    placeholder="Your name"
                    style={{
                      ...inputBase,
                      ...(focused === "contactName" ? inputFocusGold : {}),
                      ...(errors.contactName ? inputError : {}),
                    }}
                  />
                  {errors.contactName && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 6, fontWeight: 500 }}>{errors.contactName}</p>}
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px", animation: shaking.email ? "shake 0.4s ease" : "none" }}>
                    <label style={labelBase}>
                      EMAIL <span style={{ color: "var(--orange)" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="you@restaurant.com"
                      style={{
                        ...inputBase,
                        ...(focused === "email" ? inputFocusGold : {}),
                        ...(errors.email ? inputError : {}),
                      }}
                    />
                    {errors.email && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 6, fontWeight: 500 }}>{errors.email}</p>}
                  </div>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={labelBase}>PHONE</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      placeholder="(555) 123-4567"
                      style={{
                        ...inputBase,
                        ...(focused === "phone" ? inputFocusGold : {}),
                      }}
                    />
                  </div>
                </div>

                <div style={{ animation: shaking.lookingFor ? "shake 0.4s ease" : "none" }}>
                  <label style={labelBase}>
                    WHAT ARE YOU LOOKING FOR? <span style={{ color: "var(--orange)" }}>*</span>
                  </label>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}>
                    {INQUIRY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange("lookingFor", opt)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: 8,
                          border: `1px solid ${form.lookingFor === opt ? "var(--gold)" : errors.lookingFor ? "var(--red)" : "var(--cream-dim)"}`,
                          background: form.lookingFor === opt ? "var(--gold-glow)" : "transparent",
                          color: form.lookingFor === opt ? "var(--gold)" : "var(--cream-muted)",
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          fontWeight: form.lookingFor === opt ? 600 : 400,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (form.lookingFor !== opt) e.currentTarget.style.borderColor = "var(--gold)";
                        }}
                        onMouseLeave={(e) => {
                          if (form.lookingFor !== opt) e.currentTarget.style.borderColor = errors.lookingFor ? "var(--red)" : "var(--cream-dim)";
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.lookingFor && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 6, fontWeight: 500 }}>{errors.lookingFor}</p>}
                </div>

                <div>
                  <label style={labelBase}>MESSAGE</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    placeholder="Tell us about your spot, what you're looking for, or any details..."
                    rows={4}
                    style={{
                      ...inputBase,
                      resize: "vertical",
                      minHeight: 100,
                      ...(focused === "message" ? inputFocusGold : {}),
                    }}
                  />
                  <div style={{ textAlign: "right", marginTop: 6 }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: form.message.length >= 500 ? "var(--red)" : form.message.length > 400 ? "var(--gold)" : "var(--cream-dim)",
                      transition: "color 0.2s",
                    }}>
                      {form.message.length}/500
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: 16,
                    borderRadius: 10,
                    border: "none",
                    background: "var(--gradient-gold)",
                    color: "var(--bg)",
                    fontFamily: "var(--font-heading)",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "brightness(1.1)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px var(--gold-glow)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "brightness(1)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  SUBMIT INQUIRY
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Info Cards */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{ ...infoCardBase, animation: "fadeUp 0.4s ease-out 0.1s both" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(242,237,228,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
          >
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2,
              textTransform: "uppercase", color: "var(--cream-muted)",
              margin: "0 0 20px", fontWeight: 700,
            }}>WHAT WE OFFER</p>
            {[
              { emoji: "📸", text: "Full TikTok + Instagram coverage" },
              { emoji: "🎬", text: "Professional food content creation" },
              { emoji: "📊", text: `Audience of ${followers ? (followers >= 1000 ? `${(followers / 1000).toFixed(followers % 1000 === 0 ? 0 : 1)}K` : followers) : "…"}+ local food lovers` },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: 14,
                  color: "rgba(242,237,228,0.7)",
                }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div
            style={{ ...infoCardBase, animation: "fadeUp 0.4s ease-out 0.2s both" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(242,237,228,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
          >
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2,
              textTransform: "uppercase", color: "var(--cream-muted)",
              margin: "0 0 16px", fontWeight: 700,
            }}>OUR STATS</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {[
                { num: `${getFilmedCount(followers)}+`, label: "Restaurants" },
                { num: "335K+", label: "TikTok Likes" },
                { num: followers ? (followers >= 1000 ? `${(followers / 1000).toFixed(followers % 1000 === 0 ? 0 : 1)}K+` : `${followers}+`) : "…", label: "Followers" },
                { num: "100%", label: "Engagement" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center", padding: 16 }}>
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: 28,
                    color: "var(--cream)", margin: "0 0 4px", letterSpacing: 1,
                  }}>{stat.num}</p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2,
                    textTransform: "uppercase", color: "var(--cream-muted)", margin: 0,
                  }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{ ...infoCardBase, animation: "fadeUp 0.4s ease-out 0.3s both" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(242,237,228,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
          >
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2,
              textTransform: "uppercase", color: "var(--cream-muted)",
              margin: "0 0 16px", fontWeight: 700,
            }}>QUICK CONTACT</p>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 14,
              color: "var(--cream-muted)", margin: "0 0 12px",
            }}>DM us directly:</p>
            <a
              href="https://www.instagram.com/foodietwinzz/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", fontFamily: "var(--font-body)", fontSize: 14,
                color: "var(--orange)", margin: "0 0 8px", transition: "text-decoration 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >📱 @foodietwinzz on Instagram</a>
            <a
              href="https://www.tiktok.com/@foodietwinzz"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", fontFamily: "var(--font-body)", fontSize: 14,
                color: "var(--orange)", margin: "0 0 8px", transition: "text-decoration 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >📱 @foodietwinzz on TikTok</a>
            <a
              href="mailto:foodietwinzz@sanguinemgmt.biz"
              style={{
                display: "block", fontFamily: "var(--font-body)", fontSize: 14,
                color: "var(--gold)", margin: 0, transition: "text-decoration 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >📧 foodietwinzz@sanguinemgmt.biz</a>
          </div>
        </div>
      </div>
    </div>
  );
}
