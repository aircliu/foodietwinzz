import { useState } from "react";

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

const inputFocus = {
  borderColor: "var(--orange)",
  boxShadow: "0 0 0 3px var(--orange-glow)",
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

export default function Community() {
  const [form, setForm] = useState({ name: "", why: "", tiktok: "" });
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (field, value) => {
    if (field === "why" && value.length > 200) return;
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const shake = {};
    if (!form.name.trim()) { errs.name = "Restaurant name is required"; shake.name = true; }
    if (!form.why.trim()) { errs.why = "Tell us why we should go!"; shake.why = true; }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShaking(shake);
      setTimeout(() => setShaking({}), 500);
      return;
    }
    console.log("Fan Suggestion:", { restaurant: form.name, reason: form.why, tiktok: form.tiktok || null });
    setSubmitted(true);
  };

  const reset = () => {
    setForm({ name: "", why: "", tiktok: "" });
    setErrors({});
    setSubmitted(false);
  };

  const charColor = form.why.length >= 200 ? "var(--red)" : form.why.length > 160 ? "var(--orange)" : "var(--cream-dim)";

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{shakeKeyframes}</style>

      {/* Header */}
      <div style={{ paddingTop: 120, paddingBottom: 40, paddingLeft: "clamp(20px, 5vw, 60px)", paddingRight: "clamp(20px, 5vw, 60px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: "var(--orange)" }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 3,
              color: "var(--orange)",
            }}>COMMUNITY</span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 72px)",
            color: "var(--cream)",
            letterSpacing: 3,
            lineHeight: 1,
            margin: "0 0 16px",
          }}>
            SUGGEST A SPOT
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            color: "var(--cream-muted)",
            maxWidth: 560,
            lineHeight: 1.6,
          }}>
            Know a hidden gem in Anaheim? Tell us where to eat next. The best suggestions get featured on our page.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{
          background: "var(--surface-2)",
          border: "1px solid var(--cream-dim)",
          borderRadius: 16,
          padding: "clamp(28px, 5vw, 40px) clamp(20px, 4vw, 32px)",
        }}>
          {submitted ? (
            <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease-out" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔥</div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                color: "var(--cream)",
                letterSpacing: 3,
                margin: "0 0 8px",
              }}>
                SUBMITTED!
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                color: "var(--cream-muted)",
                margin: "0 0 32px",
              }}>
                We might pull up.
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
                  border: "1px solid var(--orange)",
                  background: "transparent",
                  color: "var(--orange)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--orange-glow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                SUBMIT ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ animation: shaking.name ? "shake 0.4s ease" : "none" }}>
                <label style={labelBase}>
                  RESTAURANT NAME <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="e.g. Sushi Damu"
                  style={{
                    ...inputBase,
                    ...(focused === "name" ? inputFocus : {}),
                    ...(errors.name ? inputError : {}),
                  }}
                />
                {errors.name && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 6, fontWeight: 500 }}>{errors.name}</p>}
              </div>

              <div style={{ animation: shaking.why ? "shake 0.4s ease" : "none" }}>
                <label style={labelBase}>
                  WHY SHOULD WE GO? <span style={{ color: "var(--orange)" }}>*</span>
                </label>
                <textarea
                  value={form.why}
                  onChange={(e) => handleChange("why", e.target.value)}
                  onFocus={() => setFocused("why")}
                  onBlur={() => setFocused(null)}
                  placeholder="What makes this place special?"
                  rows={3}
                  style={{
                    ...inputBase,
                    resize: "vertical",
                    minHeight: 80,
                    ...(focused === "why" ? inputFocus : {}),
                    ...(errors.why ? inputError : {}),
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <div>
                    {errors.why && <p style={{ fontSize: 12, color: "var(--red)", fontWeight: 500, margin: 0 }}>{errors.why}</p>}
                  </div>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: charColor,
                    transition: "color 0.2s",
                  }}>
                    {form.why.length}/200
                  </span>
                </div>
              </div>

              <div>
                <label style={labelBase}>YOUR TIKTOK @</label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: 16, top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-body)", fontSize: 15,
                    color: "var(--cream-muted)", pointerEvents: "none", zIndex: 1,
                  }}>@</span>
                  <input
                    type="text"
                    value={form.tiktok}
                    onChange={(e) => handleChange("tiktok", e.target.value)}
                    onFocus={() => setFocused("tiktok")}
                    onBlur={() => setFocused(null)}
                    placeholder="yourhandle"
                    style={{
                      ...inputBase,
                      paddingLeft: 32,
                      ...(focused === "tiktok" ? inputFocus : {}),
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 10,
                  border: "none",
                  background: "var(--gradient-orange)",
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
                  e.currentTarget.style.boxShadow = "0 6px 20px var(--orange-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.filter = "brightness(0.95)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.filter = "brightness(1.1)";
                }}
              >
                SUBMIT SUGGESTION
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
