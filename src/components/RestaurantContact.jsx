import React, { useState } from "react";

const inquiryOptions = [
  "Get Reviewed",
  "Book Us for Content",
  "Sponsorship / Collab",
  "Other",
];

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

export default function RestaurantContact() {
  const [form, setForm] = useState({
    restaurant: "",
    contact: "",
    email: "",
    phone: "",
    inquiry: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const handleChange = (field, value) => {
    if (field === "message" && value.length > 500) return;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const isValidEmail = (email) => {
    return email.includes("@") && email.includes(".");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.restaurant.trim()) newErrors.restaurant = true;
    if (!form.contact.trim()) newErrors.contact = true;
    if (!form.email.trim() || !isValidEmail(form.email)) newErrors.email = true;
    if (!form.inquiry) newErrors.inquiry = true;
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    // TODO: connect to Formspree, email API, or Google Forms
    console.log("Restaurant Inquiry:", form);
    setSubmitted(true);
  };

  const reset = () => {
    setForm({
      restaurant: "",
      contact: "",
      email: "",
      phone: "",
      inquiry: "",
      message: "",
    });
    setSubmitted(false);
    setErrors({});
  };

  const getInputStyle = (field) => ({
    ...inputStyle,
    borderColor: errors[field]
      ? "#e53935"
      : focused === field
      ? "#D4A853"
      : "rgba(255,255,255,0.08)",
    boxShadow:
      focused === field
        ? "0 0 0 2px rgba(212,168,83,0.2)"
        : errors[field]
        ? "0 0 0 2px rgba(229,57,53,0.15)"
        : "none",
  });

  return (
    <section
      id="contact"
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
            background: "#D4A853",
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
          FOR RESTAURANTS
        </h2>
        <p
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 15,
            color: "rgba(245,240,232,0.4)",
            margin: "0 0 12px",
            lineHeight: 1.5,
          }}
        >
          Want us to feature your spot? Let's talk.
        </p>
        <p
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 12,
            color: "#D4A853",
            margin: 0,
            letterSpacing: 0.5,
          }}
        >
          Featured 7+ Anaheim restaurants and counting
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(212,168,83,0.1)",
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
                placeholder="Your restaurant name"
                style={getInputStyle("restaurant")}
              />
            </div>

            {/* Contact Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Contact Name *</label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                onFocus={() => setFocused("contact")}
                onBlur={() => setFocused(null)}
                placeholder="Who should we reach out to?"
                style={getInputStyle("contact")}
              />
            </div>

            {/* Email + Phone row */}
            <div
              className="form-row-2col"
              style={{
                marginBottom: 20,
              }}
            >
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@restaurant.com"
                  style={getInputStyle("email")}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  placeholder="(555) 123-4567"
                  style={getInputStyle("phone")}
                />
              </div>
            </div>

            {/* Inquiry Type — pill buttons */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>What are you looking for? *</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {inquiryOptions.map((opt) => {
                  const selected = form.inquiry === opt;
                  const hasError = errors.inquiry && !form.inquiry;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange("inquiry", opt)}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 20,
                        border: `1px solid ${
                          hasError
                            ? "#e53935"
                            : selected
                            ? "#D4A853"
                            : "rgba(255,255,255,0.08)"
                        }`,
                        background: selected
                          ? "rgba(212,168,83,0.12)"
                          : "rgba(255,255,255,0.03)",
                        color: selected ? "#D4A853" : "rgba(245,240,232,0.5)",
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        outline: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!selected)
                          e.currentTarget.style.borderColor =
                            "rgba(212,168,83,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        if (!selected)
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.08)";
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Message (optional)</label>
              <textarea
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                placeholder="Anything else you'd like us to know?"
                rows={4}
                style={{
                  ...getInputStyle("message"),
                  resize: "vertical",
                  minHeight: 100,
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 10,
                  color:
                    form.message.length >= 475
                      ? "#D4A853"
                      : "rgba(245,240,232,0.25)",
                  marginTop: 4,
                }}
              >
                {form.message.length}/500
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
                background: "linear-gradient(135deg,#D4A853,#C9A84C)",
                color: "#050505",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(212,168,83,0.3)";
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
              SEND INQUIRY
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
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 36,
                color: "#F5F0E8",
                margin: "0 0 8px",
                letterSpacing: 2,
              }}
            >
              WE GOT IT.
            </h3>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: 15,
                color: "rgba(245,240,232,0.4)",
                margin: "0 0 28px",
              }}
            >
              We'll be in touch within 48 hours.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                border: "1px solid rgba(212,168,83,0.3)",
                background: "rgba(212,168,83,0.08)",
                color: "#D4A853",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 14,
                letterSpacing: 1.5,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,168,83,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212,168,83,0.08)";
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
