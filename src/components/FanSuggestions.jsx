import React, { useState } from "react";

const inputStyle = {
  width: "100%",
  background: "#0a0a0a",
  color: "#F5F0E8",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: "14px 16px",
  fontSize: 14,
  fontFamily: "'Outfit',sans-serif",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const labelStyle = {
  fontFamily: "'Space Mono',monospace",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 1.5,
  color: "rgba(245,240,232,0.4)",
  marginBottom: 6,
  display: "block",
};

export default function FanSuggestions() {
  const [form, setForm] = useState({ restaurant: "", reason: "", tiktok: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const handleChange = (field, value) => {
    if (field === "reason" && value.length > 200) return;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.restaurant.trim()) newErrors.restaurant = true;
    if (!form.reason.trim()) newErrors.reason = true;
    if (!form.tiktok.trim()) newErrors.tiktok = true;
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    const url = "https://docs.google.com/forms/d/e/1FAIpQLSc9DiMavGKY3hko6zfVGB74TibWgT2oVrKCnC4VWOREHPoSKg/formResponse?"
      + `entry.1158994347=${encodeURIComponent(form.restaurant)}`
      + `&entry.625321071=${encodeURIComponent(form.reason)}`
      + `&entry.441535905=${encodeURIComponent(form.tiktok)}`;
    new Image().src = url;
    setSubmitted(true);
  };

  const reset = () => {
    setForm({ restaurant: "", reason: "", tiktok: "" });
    setSubmitted(false);
    setErrors({});
  };

  const getInputStyle = (field) => ({
    ...inputStyle,
    borderColor: errors[field]
      ? "#e53935"
      : focused === field
      ? "#E8613C"
      : "rgba(255,255,255,0.08)",
    boxShadow:
      focused === field
        ? "0 0 0 2px rgba(232,97,60,0.2)"
        : errors[field]
        ? "0 0 0 2px rgba(229,57,53,0.15)"
        : "none",
  });

  return (
    <section
      id="suggest"
      style={{
        padding: "64px 0 48px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            width: 40,
            height: 3,
            background: "#E8613C",
            borderRadius: 2,
            marginBottom: 16,
          }}
        />
        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(42px,8vw,56px)",
            color: "#F5F0E8",
            margin: "0 0 8px",
            lineHeight: 1,
            letterSpacing: 1,
          }}
        >
          SUGGEST A SPOT
        </h2>
        <p
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 15,
            color: "rgba(245,240,232,0.4)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Know a hidden gem in Anaheim? Tell us where to eat next.
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20,
          padding: "clamp(24px,5vw,36px)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate>
            {/* Restaurant Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Restaurant Name *</label>
              <input
                type="text"
                value={form.restaurant}
                onChange={(e) => handleChange("restaurant", e.target.value)}
                onFocus={() => setFocused("restaurant")}
                onBlur={() => setFocused(null)}
                placeholder="e.g. Taco María"
                style={getInputStyle("restaurant")}
              />
            </div>

            {/* Why */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Why should we go? *</label>
              <textarea
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                onFocus={() => setFocused("reason")}
                onBlur={() => setFocused(null)}
                placeholder="What makes this place special?"
                rows={3}
                style={{
                  ...getInputStyle("reason"),
                  resize: "vertical",
                  minHeight: 80,
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 10,
                  color:
                    form.reason.length >= 190
                      ? "#E8613C"
                      : "rgba(245,240,232,0.25)",
                  marginTop: 4,
                }}
              >
                {form.reason.length}/200
              </div>
            </div>

            {/* TikTok handle */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Your Instagram *</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(245,240,232,0.3)",
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 14,
                    pointerEvents: "none",
                  }}
                >
                  @
                </span>
                <input
                  type="text"
                  value={form.tiktok}
                  onChange={(e) => handleChange("tiktok", e.target.value)}
                  onFocus={() => setFocused("tiktok")}
                  onBlur={() => setFocused(null)}
                  placeholder="yourusername"
                  style={{ ...getInputStyle("tiktok"), paddingLeft: 32 }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#E8613C,#d4532f)",
                color: "#F5F0E8",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16,
                letterSpacing: 2,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(232,97,60,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
            >
              SUBMIT SUGGESTION
            </button>
          </form>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              animation: "fadeIn 0.5s ease-out",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔥</div>
            <h3
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 36,
                color: "#F5F0E8",
                margin: "0 0 8px",
                letterSpacing: 2,
              }}
            >
              SUBMITTED!
            </h3>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: 15,
                color: "rgba(245,240,232,0.4)",
                margin: "0 0 28px",
              }}
            >
              We might pull up.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                border: "1px solid rgba(232,97,60,0.3)",
                background: "rgba(232,97,60,0.08)",
                color: "#E8613C",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 14,
                letterSpacing: 1.5,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(232,97,60,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(232,97,60,0.08)";
              }}
            >
              SUBMIT ANOTHER
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
