import RestaurantInquiry from "./RestaurantInquiry";

export default function InquiryPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0a0a0a 0%,#111318 40%,#0d1117 100%)",
      padding: "48px 20px 60px",
      fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <a
          href={window.location.pathname}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none",
            marginBottom: 24, fontWeight: 600,
          }}
        >
          ← Back to FoodieTwinzz
        </a>
        <RestaurantInquiry />
      </div>
    </div>
  );
}
