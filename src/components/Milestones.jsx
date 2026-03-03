import { useState, useEffect, useRef } from "react";

const milestones = [
  { followers: "4K", budget: "$40", status: "filmed", spot: "Musubi Square", item: "Sushi Taco Spread", address: "2626 W La Palma Ave, Anaheim", vibe: "Wagyu Feta Taco $9 · Soft Shell Crab $7 · Spam Trio $7 · Bulgogi Bowl $14", emoji: "🍣", total: "~$37" },
  { followers: "5K", budget: "$50", status: "next", spot: "Tacos Los Cholos", item: "Prime Tacos + Cholo Pizza", address: "821 S State College Blvd, Anaheim", vibe: "LA Taco Madness Champs — Filet Mignon tacos + Cholo Pizza", emoji: "🌮", total: "~$50" },
  { followers: "6K", budget: "$60", status: "locked", spot: "Anaheim Packing House", item: "Food Hall Crawl — 4 Vendors", address: "440 S Anaheim Blvd, Anaheim", vibe: "Anti-Gravity Noodles · Soul Food · Dim Sum · Popgelato", emoji: "🍜", total: "~$58" },
  { followers: "7K", budget: "$70", status: "locked", spot: "Sona Fusion Kitchen", item: "Vietnamese-Peruvian Fusion Feast", address: "2054 S Euclid St, Anaheim", vibe: "Truffle Fries · Lomo Saltado · Pho · Garlic Noodles", emoji: "🔥", total: "~$67" },
  { followers: "8K", budget: "$80", status: "locked", spot: "Khan Saab", item: "Michelin Bib Gourmand Dinner", address: "1 S Lemon St, Fullerton", vibe: "Pani Puri · Smoked Beef Kebab · Lamb Chops · Biryani", emoji: "👑", total: "~$80" },
  { followers: "9K", budget: "$90", status: "locked", spot: "Heritage 71 BBQ", item: "Texas BBQ Meat Feast", address: "3451 E Miraloma Ave, Anaheim", vibe: "½lb Brisket · 3 Ribs · Pulled Pork · Mac & Cheese", emoji: "🥩", total: "~$88" },
  { followers: "10K", budget: "$100", status: "locked", spot: "The Wooden Pearl", item: "Surf & Turf Celebration", address: "440 S Anaheim Blvd, Anaheim", vibe: "Premium steak, fresh seafood & craft cocktails", emoji: "🥂", total: "~$100" },
];

const filmed = milestones.filter(m => m.status === "filmed").length;

function StatusBadge({ status }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 14px",
    borderRadius: 20,
    fontSize: 11,
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  };
  if (status === "filmed") return <span style={{ ...base, background: "rgba(76,175,80,0.15)", color: "#66BB6A", border: "1px solid rgba(76,175,80,0.3)" }}>Filmed</span>;
  if (status === "next") return <span style={{ ...base, background: "rgba(232,97,60,0.15)", color: "#E8613C", border: "1px solid rgba(232,97,60,0.35)", animation: "milestonePulse 2s ease-in-out infinite" }}>Up Next</span>;
  return <span style={{ ...base, background: "rgba(245,240,232,0.04)", color: "rgba(245,240,232,0.3)", border: "1px dashed rgba(245,240,232,0.12)" }}>🔒 Locked</span>;
}

function MilestoneCard({ data, index, side, visible }) {
  const [hovered, setHovered] = useState(false);
  const isLocked = data.status === "locked";

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "clamp(16px, 3vw, 24px) clamp(16px, 4vw, 28px)",
        borderRadius: 14,
        background: hovered ? "rgba(245,240,232,0.06)" : "rgba(245,240,232,0.03)",
        border: `1px solid ${data.status === "next" ? "rgba(232,97,60,0.35)" : hovered ? "rgba(245,240,232,0.12)" : "rgba(245,240,232,0.06)"}`,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform: visible
          ? hovered ? "translateY(-4px)" : "translateY(0)"
          : side === "left" ? "translateX(-40px)" : "translateX(40px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
        filter: isLocked ? "blur(0.5px)" : "none",
        overflow: "hidden",
      }}
    >
      {/* Locked overlay */}
      {isLocked && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "rgba(5,5,5,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 14, pointerEvents: "none",
        }}>
          <span style={{ fontSize: 28, opacity: 0.4 }}>🔒</span>
        </div>
      )}

      {/* Top row: budget circle + followers + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: data.status === "filmed"
            ? "linear-gradient(135deg, rgba(76,175,80,0.2), rgba(76,175,80,0.08))"
            : data.status === "next"
              ? "linear-gradient(135deg, rgba(232,97,60,0.25), rgba(212,168,83,0.1))"
              : "rgba(245,240,232,0.04)",
          border: `2px solid ${data.status === "filmed" ? "rgba(76,175,80,0.35)" : data.status === "next" ? "rgba(232,97,60,0.4)" : "rgba(245,240,232,0.08)"}`,
        }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 22,
            color: data.status === "filmed" ? "#66BB6A" : data.status === "next" ? "#E8613C" : "rgba(245,240,232,0.25)",
            letterSpacing: 0.5,
          }}>{data.budget}</span>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 12,
            color: "rgba(245,240,232,0.4)", fontWeight: 400,
          }}>{data.followers} followers</span>
          <div style={{ marginTop: 4 }}><StatusBadge status={data.status} /></div>
        </div>
        <span style={{ fontSize: 28, opacity: isLocked ? 0.25 : 1 }}>{data.emoji}</span>
      </div>

      {/* Content */}
      <div style={{ opacity: isLocked ? 0.35 : 1 }}>
        <h3 style={{
          margin: "0 0 2px", fontFamily: "'Outfit', sans-serif",
          fontSize: 18, fontWeight: 700, color: "#F5F0E8",
        }}>{data.spot}</h3>
        <p style={{
          margin: "0 0 8px", fontFamily: "'Outfit', sans-serif",
          fontSize: 14, fontWeight: 500, color: "rgba(245,240,232,0.6)",
        }}>{data.item}</p>
        <p style={{
          margin: "0 0 10px", fontFamily: "'Outfit', sans-serif",
          fontSize: 12.5, color: "rgba(245,240,232,0.3)", fontStyle: "italic", lineHeight: 1.5,
        }}>{data.vibe}</p>

        {/* Price + address row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          {data.status !== "locked" && (
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700,
              color: data.status === "filmed" ? "#66BB6A" : "#E8613C",
            }}>{data.total}</span>
          )}
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 11.5,
            color: "rgba(245,240,232,0.25)",
          }}>📍 {data.address}</span>
        </div>
      </div>
    </div>
  );

  return card;
}

export default function Milestones() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="challenge" ref={sectionRef} style={{ padding: "80px 0" }}>
      <style>{`
        @keyframes milestonePulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @media (max-width: 768px) {
          .milestone-timeline { padding-left: 32px !important; }
          .milestone-timeline::before { left: 12px !important; }
          .milestone-timeline-line { left: 12px !important; transform: none !important; }
          .milestone-row { flex-direction: column !important; }
          .milestone-card-left, .milestone-card-right { width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; }
          .milestone-spacer { display: none !important; }
          .milestone-node { left: 12px !important; right: auto !important; transform: translateX(-50%) !important; }
          .milestone-connector { display: none !important; }
        }
        @media (max-width: 480px) {
          .milestone-timeline { padding-left: 24px !important; }
          .milestone-timeline-line { left: 8px !important; }
          .milestone-node { left: 8px !important; }
        }
      `}</style>

      {/* Section Header */}
      <div style={{
        textAlign: "center", marginBottom: 48,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s ease-out",
      }}>
        <div style={{ width: 48, height: 3, background: "#E8613C", margin: "0 auto 16px", borderRadius: 2 }} />
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(48px, 8vw, 64px)",
          color: "#F5F0E8",
          margin: "0 0 10px",
          letterSpacing: 3,
          lineHeight: 1,
        }}>THE CHALLENGE</h2>
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15, color: "rgba(245,240,232,0.4)",
          margin: 0, fontWeight: 400,
        }}>Every milestone unlocks a new spot</p>
      </div>

      {/* Progress Bar */}
      <div style={{
        marginBottom: 56,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(15px)",
        transition: "all 0.6s ease-out 0.15s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 12,
            color: "rgba(245,240,232,0.3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 1,
          }}>Progress</span>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 12,
            color: "rgba(232,97,60,0.7)", fontWeight: 700,
          }}>{filmed}/{milestones.length} FILMED</span>
        </div>
        <div style={{
          height: 4, borderRadius: 2, background: "rgba(245,240,232,0.06)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 2,
            width: visible ? `${(filmed / milestones.length) * 100}%` : "0%",
            background: "linear-gradient(90deg, #E8613C, #D4A853)",
            boxShadow: "0 0 16px rgba(232,97,60,0.4)",
            transition: "width 1.4s cubic-bezier(0.4,0,0.2,1) 0.4s",
          }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="milestone-timeline" style={{ position: "relative" }}>
        {/* Vertical center line */}
        <div className="milestone-timeline-line" style={{
          position: "absolute", left: "50%", top: 0, bottom: 0, width: 2,
          background: "linear-gradient(180deg, rgba(232,97,60,0.4) 0%, rgba(232,97,60,0.1) 100%)",
          transform: "translateX(-50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.3s",
        }} />

        {milestones.map((m, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <div
              key={i}
              className="milestone-row"
              style={{
                display: "flex", alignItems: "flex-start", position: "relative",
                marginBottom: i < milestones.length - 1 ? 24 : 0,
              }}
            >
              {/* Left card or spacer */}
              {side === "left" ? (
                <div className="milestone-card-left" style={{ width: "calc(50% - 28px)", marginRight: 28 }}>
                  <MilestoneCard data={m} index={i} side="left" visible={visible} />
                </div>
              ) : (
                <div className="milestone-spacer" style={{ width: "calc(50% - 28px)", marginRight: 28 }} />
              )}

              {/* Timeline node */}
              <div className="milestone-node" style={{
                position: "absolute", left: "50%", top: 20,
                transform: "translateX(-50%)",
                width: m.status === "next" ? 18 : 14,
                height: m.status === "next" ? 18 : 14,
                borderRadius: "50%",
                background: m.status === "filmed"
                  ? "#66BB6A"
                  : m.status === "next"
                    ? "#E8613C"
                    : "rgba(245,240,232,0.1)",
                border: m.status === "next" ? "3px solid rgba(232,97,60,0.3)" : "2px solid rgba(245,240,232,0.08)",
                boxShadow: m.status === "filmed"
                  ? "0 0 12px rgba(76,175,80,0.4)"
                  : m.status === "next"
                    ? "0 0 16px rgba(232,97,60,0.5)"
                    : "none",
                zIndex: 2,
                opacity: visible ? 1 : 0,
                transition: `opacity 0.4s ease-out ${0.3 + i * 0.08}s`,
              }} />

              {/* Connector line from node to card */}
              <div className="milestone-connector" style={{
                position: "absolute",
                top: 26,
                left: side === "left" ? "calc(50% - 28px)" : "50%",
                width: 28,
                height: 1,
                background: `rgba(${m.status === "filmed" ? "76,175,80" : m.status === "next" ? "232,97,60" : "245,240,232"},0.15)`,
                zIndex: 1,
              }} />

              {/* Right card or spacer */}
              {side === "right" ? (
                <div className="milestone-card-right" style={{ width: "calc(50% - 28px)", marginLeft: 28 }}>
                  <MilestoneCard data={m} index={i} side="right" visible={visible} />
                </div>
              ) : (
                <div className="milestone-spacer" style={{ width: "calc(50% - 28px)", marginLeft: 28 }} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
