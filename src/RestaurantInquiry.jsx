import { useState } from "react";

const inquiryOptions = [
  "Get Reviewed",
  "Book Us for Content",
  "Sponsorship / Collab",
  "Other",
];

const GOLD = "#D4A853";
const GOLD_DARK = "#C9A84C";

export default function RestaurantInquiry() {
  const [form, setForm] = useState({
    restaurantName: "",
    contactName: "",
    email: "",
    phone: "",
    lookingFor: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.restaurantName.trim()) errs.restaurantName = "Required";
    if (!form.contactName.trim()) errs.contactName = "Required";
    if (!form.email.trim()) {
      errs.email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email";
    }
    if (!form.lookingFor) errs.lookingFor = "Please select an option";
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // TODO: connect to Formspree, email API, or Google Forms
    console.log("Restaurant Inquiry Submitted:", form);
    setSubmitted(true);
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: `1px solid ${hasError ? "#e74c3c" : "rgba(255,255,255,0.1)"}`,
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 6,
    letterSpacing: 0.3,
  };

  const errorStyle = {
    fontSize: 11,
    color: "#e74c3c",
    marginTop: 4,
    fontWeight: 500,
  };

  if (submitted) {
    return (
      <section style={{
        marginTop: 48,
        padding: "40px 28px",
        borderRadius: 20,
        background: "rgba(212,168,83,0.04)",
        border: "1px solid rgba(212,168,83,0.18)",
        boxShadow: "0 0 30px rgba(212,168,83,0.06)",
        textAlign: "center",
        animation: "slideUp 0.5s ease-out",
      }}>
        <p style={{ fontSize: 22, color: "#fff", fontWeight: 700, margin: "0 0 8px" }}>
          Got it! We'll be in touch within 48 hours.
        </p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Thanks for reaching out, {form.contactName}!
        </p>
      </section>
    );
  }

  return (
    <section style={{
      marginTop: 48,
      padding: "36px 28px 32px",
      borderRadius: 20,
      background: "rgba(212,168,83,0.03)",
      border: "1px solid rgba(212,168,83,0.15)",
      boxShadow: "0 0 40px rgba(212,168,83,0.05), inset 0 1px 0 rgba(212,168,83,0.08)",
      animation: "slideUp 0.9s ease-out",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(24px,6vw,32px)",
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 8px",
          letterSpacing: -0.5,
        }}>
          <span role="img" aria-label="handshake">&#x1F91D;</span> For Restaurants
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 10px", fontWeight: 500 }}>
          Want us to feature your spot? Let's talk.
        </p>
        <p style={{ fontSize: 12, color: GOLD, fontWeight: 600, opacity: 0.7, margin: 0 }}>
          We've featured 7+ Anaheim restaurants and counting
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Row: Restaurant Name + Contact Name */}
        <div className="restaurant-form-row">
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Restaurant Name *</label>
            <input
              type="text"
              value={form.restaurantName}
              onChange={(e) => handleChange("restaurantName", e.target.value)}
              placeholder="e.g. Khan Saab"
              className="restaurant-input"
              style={inputStyle(errors.restaurantName)}
            />
            {errors.restaurantName && <p style={errorStyle}>{errors.restaurantName}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Contact Name *</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
              placeholder="Your name"
              className="restaurant-input"
              style={inputStyle(errors.contactName)}
            />
            {errors.contactName && <p style={errorStyle}>{errors.contactName}</p>}
          </div>
        </div>

        {/* Row: Email + Phone */}
        <div className="restaurant-form-row">
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@restaurant.com"
              className="restaurant-input"
              style={inputStyle(errors.email)}
            />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className="restaurant-input"
              style={inputStyle(false)}
            />
          </div>
        </div>

        {/* Custom Dropdown */}
        <div>
          <label style={labelStyle}>What are you looking for? *</label>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="restaurant-input"
              style={{
                ...inputStyle(errors.lookingFor),
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: form.lookingFor ? "#fff" : "rgba(255,255,255,0.3)" }}>
                {form.lookingFor || "Select an option"}
              </span>
              <span style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}>&#9660;</span>
            </button>
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                borderRadius: 10,
                background: "#1a1a1f",
                border: "1px solid rgba(212,168,83,0.2)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                zIndex: 10,
                overflow: "hidden",
              }}>
                {inquiryOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      handleChange("lookingFor", opt);
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "11px 16px",
                      border: "none",
                      background: form.lookingFor === opt ? "rgba(212,168,83,0.12)" : "transparent",
                      color: form.lookingFor === opt ? GOLD : "rgba(255,255,255,0.7)",
                      fontSize: 14,
                      fontFamily: "inherit",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (form.lookingFor !== opt) e.target.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = form.lookingFor === opt ? "rgba(212,168,83,0.12)" : "transparent";
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.lookingFor && <p style={errorStyle}>{errors.lookingFor}</p>}
        </div>

        {/* Message */}
        <div>
          <label style={labelStyle}>
            Message (optional)
            <span style={{ float: "right", color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>
              {form.message.length}/500
            </span>
          </label>
          <textarea
            value={form.message}
            onChange={(e) => {
              if (e.target.value.length <= 500) handleChange("message", e.target.value);
            }}
            placeholder="Tell us about your spot, what you're looking for, or any details..."
            rows={4}
            className="restaurant-input"
            style={{
              ...inputStyle(false),
              resize: "vertical",
              minHeight: 90,
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="restaurant-submit-btn"
          style={{
            width: "100%",
            padding: "15px 24px",
            borderRadius: 12,
            border: "none",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
            color: "#1a1200",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
            letterSpacing: 0.3,
            transition: "box-shadow 0.3s, transform 0.2s",
            marginTop: 4,
          }}
        >
          Submit Inquiry
        </button>
      </form>
    </section>
  );
}
