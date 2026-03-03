import { useState, useRef, useEffect } from "react";

const milestones = [
  { followers: "4,000", budget: 40, status: "filmed", spot: "Musubi Square", item: "Sushi Taco Spread", address: "2626 W La Palma Ave, Anaheim, CA 92801", vibe: "Wagyu Feta Taco $9 \u00b7 Soft Shell Crab $7 \u00b7 Spam Trio $7 \u00b7 Bulgogi Bowl $14", emoji: "\u{1F363}", total: "$37", tiktokViews: "12K" },
  { followers: "5,000", budget: 50, status: "next", spot: "Tacos Los Cholos", item: "Prime Tacos + Cholo Pizza", address: "821 S State College Blvd, Anaheim, CA 92806", vibe: "LA Taco Madness Champs \u2014 Filet Mignon tacos $7.50ea + Cholo Pizza $28", emoji: "\u{1F32E}", total: "$50", tiktokViews: null },
  { followers: "6,000", budget: 60, status: "locked", spot: "Anaheim Packing House", item: "Food Hall Crawl \u2014 4 Vendors", address: "440 S Anaheim Blvd, Anaheim, CA 92805", vibe: "Anti-Gravity Noodles \u00b7 Soul Food \u00b7 18 Folds Dim Sum \u00b7 Popgelato", emoji: "\u{1F35C}", total: "$58", tiktokViews: null },
  { followers: "7,000", budget: 70, status: "locked", spot: "Sona Fusion Kitchen", item: "Vietnamese-Peruvian Fusion Feast", address: "2054 S Euclid St, Anaheim, CA 92802", vibe: "Truffle Fries \u00b7 Lomo Saltado \u00b7 Shrimp Wontons \u00b7 Pho \u00b7 Garlic Noodles", emoji: "\u{1F525}", total: "$67", tiktokViews: null },
  { followers: "8,000", budget: 80, status: "locked", spot: "Khan Saab", item: "Michelin Bib Gourmand Dinner", address: "1 S Lemon St, Fullerton, CA 92832", vibe: "Pani Puri \u00b7 Smoked Beef Kebab \u00b7 Lamb Chops \u00b7 Naan \u00b7 Biryani", emoji: "\u{1F451}", total: "$80", tiktokViews: null },
  { followers: "9,000", budget: 90, status: "locked", spot: "Heritage 71 BBQ", item: "Texas BBQ Meat Feast", address: "3451 E Miraloma Ave, Anaheim, CA 92806", vibe: "\u00bdlb Brisket \u00b7 3 Ribs \u00b7 Pulled Pork \u00b7 Mac & Cheese \u00b7 Truffle Fries", emoji: "\u{1F969}", total: "$88", tiktokViews: null },
  { followers: "10,000", budget: 100, status: "locked", spot: "The Wooden Pearl", item: "Surf & Turf Celebration", address: "440 S Anaheim Blvd, Anaheim, CA 92805", vibe: "Premium steak, fresh seafood & craft cocktails", emoji: "\u{1F942}", total: "$100", tiktokViews: null },
];

const TABS = ["ALL", "FILMED", "UP NEXT", "LOCKED"];
const tabToStatus = { ALL: null, FILMED: "filmed", "UP NEXT": "next", LOCKED: "locked" };

const filmed = milestones.filter((m) => m.status === "filmed").length;
const totalSpent = milestones.filter((m) => m.status === "filmed").reduce((s, m) => s + m.budget, 0);
const totalAll = milestones.reduce((s, m) => s + m.budget, 0);

function Badge({ status }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
  if (status === "filmed")
    return <span style={{ ...base, background: "var(--green)", color: "#003D00" }}>FILMED {"\u2713"}</span>;
  if (status === "next")
    return (
      <span style={{ ...base, background: "var(--orange)", color: "var(--bg)", animation: "badgePulse 2s ease-in-out infinite" }}>
        UP NEXT
      </span>
    );
  return (
    <span style={{ ...base, background: "rgba(255,255,255,0.06)", color: "var(--cream-dim)", border: "1px dashed var(--cream-dim)" }}>
      LOCKED {"\u{1F512}"}
    </span>
  );
}

function BudgetCircle({ status, budget }) {
  const shared = {
    width: 80,
    height: 80,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
  if (status === "filmed")
    return (
      <div style={{ ...shared, background: "linear-gradient(135deg, var(--green), #00E676)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#fff" }}>${budget}</span>
      </div>
    );
  if (status === "next")
    return (
      <div style={{ ...shared, background: "linear-gradient(135deg, var(--orange), #FF8F00)", boxShadow: "0 0 20px var(--orange-glow)", animation: "circlePulse 2.5s ease-in-out infinite" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#fff" }}>${budget}</span>
      </div>
    );
  return (
    <div style={{ ...shared, background: "var(--surface)", border: "2px dashed var(--cream-dim)" }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--cream-dim)" }}>${budget}</span>
    </div>
  );
}

function MilestoneCard({ data, index, visible }) {
  const [hover, setHover] = useState(false);
  const isLocked = data.status === "locked";
  const isNext = data.status === "next";
  const isFilmed = data.status === "filmed";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="challenge-card-row"
      style={{
        display: "flex",
        gap: 0,
        padding: 24,
        borderRadius: 16,
        background: isNext ? "linear-gradient(135deg, var(--surface), rgba(232,97,60,0.04))" : "var(--surface)",
        border: `1px solid ${hover ? (isFilmed ? "rgba(0,200,83,0.3)" : isNext ? "rgba(232,97,60,0.35)" : "rgba(245,240,232,0.12)") : "var(--cream-dim)"}`,
        borderLeft: isFilmed ? "3px solid var(--green)" : isNext ? "3px solid var(--orange)" : undefined,
        transition: "all 0.3s ease",
        transform: visible ? (hover ? "translateY(-3px)" : "translateY(0)") : "translateY(24px)",
        opacity: visible ? 1 : 0,
        boxShadow: hover ? "0 12px 32px rgba(0,0,0,0.3)" : "none",
        animationDelay: `${index * 0.05}s`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Budget circle */}
      <div className="challenge-card-circle">
        <BudgetCircle status={data.status} budget={data.budget} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingLeft: 24, minWidth: 0, filter: isLocked ? "blur(0.5px)" : "none", opacity: isLocked ? 0.5 : 1 }} className="challenge-card-content">
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cream-muted)" }}>{data.followers} followers</span>
          <Badge status={data.status} />
        </div>

        {/* Item name */}
        <h3 style={{ fontFamily: "var(--font-body)", fontSize: 20, fontWeight: 700, color: "var(--cream)", margin: "8px 0 0" }}>
          <span style={{ marginRight: 8 }}>{data.emoji}</span>
          {data.item}
        </h3>

        {/* Restaurant name */}
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500, color: "rgba(245,240,232,0.7)", margin: "4px 0 0" }}>
          {data.spot}
        </p>

        {/* Vibe */}
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontStyle: "italic", color: "rgba(245,240,232,0.35)", margin: "6px 0 0" }}>
          {data.vibe}
        </p>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {!isLocked && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: isFilmed ? "var(--green)" : "var(--orange)" }}>
                {data.total}
              </span>
            )}
            {data.tiktokViews && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cream-muted)" }}>
                {"\u25B6"} {data.tiktokViews} views
              </span>
            )}
          </div>
          <span style={{ fontSize: 12, color: "var(--cream-muted)" }}>
            {"\u{1F4CD}"} Anaheim
          </span>
        </div>
      </div>

      {/* Locked overlay icon */}
      {isLocked && (
        <div style={{
          position: "absolute",
          top: "50%",
          right: 28,
          transform: "translateY(-50%)",
          fontSize: 28,
          opacity: 0.08,
          pointerEvents: "none",
        }}>
          {"\u{1F512}"}
        </div>
      )}
    </div>
  );
}

export default function Challenge() {
  const [tab, setTab] = useState("ALL");
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [fadeKey, setFadeKey] = useState(0);
  const cardRefs = useRef({});

  const filtered =
    tab === "ALL"
      ? milestones
      : milestones.filter((m) => m.status === tabToStatus[tab]);

  const handleTab = (t) => {
    setTab(t);
    setVisibleCards(new Set());
    setFadeKey((k) => k + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(entry.target.dataset.idx));
          }
        });
      },
      { threshold: 0.1 },
    );

    const refs = cardRefs.current;
    Object.values(refs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      Object.values(refs).forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [fadeKey]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{`
        @keyframes badgePulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        @keyframes circlePulse { 0%,100%{box-shadow:0 0 20px var(--orange-glow)} 50%{box-shadow:0 0 35px var(--orange-glow)} }

        .challenge-card-row {
          flex-direction: row;
          align-items: center;
        }
        .challenge-card-circle {
          display: flex;
          justify-content: center;
        }
        .challenge-card-content {
          padding-left: 24px !important;
        }
        @media (max-width: 640px) {
          .challenge-card-row {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center;
          }
          .challenge-card-circle {
            margin-bottom: 16px;
          }
          .challenge-card-content {
            padding-left: 0 !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div style={{ paddingTop: 120, paddingBottom: 40, paddingLeft: 20, paddingRight: 20, maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 8vw, 72px)",
          fontWeight: 400,
          color: "var(--cream)",
          margin: "0 0 16px",
          letterSpacing: 4,
          lineHeight: 1,
        }}>
          THE CHALLENGE
        </h1>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.6,
          color: "rgba(245,240,232,0.6)",
          margin: "0 0 20px",
          maxWidth: 600,
        }}>
          $1 for every 100 followers. Each milestone unlocks a new Anaheim restaurant.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { value: `${filmed}/${milestones.length}`, label: "FILMED", color: "var(--orange)" },
            { value: `$${totalSpent}`, label: "SPENT SO FAR", color: "var(--cream-muted)" },
            { value: `$${totalAll}`, label: "TOTAL IF COMPLETED", color: "var(--cream-muted)" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                minWidth: 140,
                background: "var(--surface)",
                border: "1px solid var(--cream-dim)",
                borderRadius: 12,
                padding: "20px 28px",
                textAlign: "center",
              }}
            >
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 36, color: "var(--cream)", lineHeight: 1.1 }}>
                {stat.value}
              </span>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: stat.color, letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs + Progress */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => handleTab(t)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  letterSpacing: 2,
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: active ? "var(--orange)" : "transparent",
                  color: active ? "var(--bg)" : "var(--cream-muted)",
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.target.style.background = "var(--cream-dim)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.target.style.background = "transparent";
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 2, background: "var(--surface)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${(filmed / milestones.length) * 100}%`,
            borderRadius: 2,
            background: "var(--orange)",
            boxShadow: "0 0 12px var(--orange-glow)",
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      </div>

      {/* Milestone Cards */}
      <div key={fadeKey} style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((m, i) => {
          const key = `${m.followers}-${fadeKey}`;
          return (
            <div
              key={key}
              ref={(el) => { cardRefs.current[key] = el; }}
              data-idx={key}
            >
              <MilestoneCard data={m} index={i} visible={visibleCards.has(key)} />
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--cream-muted)", textAlign: "center", padding: "40px 0" }}>
            No milestones in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
