import { useState, useEffect, useRef, useCallback } from "react";

const products = [
  {
    name: "Signature Chopsticks",
    tagline: "The OG. Engraved bamboo with burnt orange tips.",
    price: "$18",
    badge: "BEST SELLER",
    emoji: "\u{1F962}",
    category: "accessories",
    comingSoon: false,
  },
  {
    name: "Premium Metal Chopsticks",
    tagline: "Stainless steel. Gold-tipped. For the real ones.",
    price: "$32",
    badge: "LIMITED",
    emoji: "\u2728",
    category: "accessories",
    comingSoon: false,
  },
  {
    name: "Chopstick + Ramen Bowl Set",
    tagline: "Branded ceramic bowl with matching chopsticks & spoon.",
    price: "$45",
    badge: "NEW",
    emoji: "\u{1F35C}",
    category: "accessories",
    comingSoon: false,
  },
  {
    name: "Classic Logo Tee",
    tagline: "Heavyweight cotton. FoodieTwinzz logo front, Anaheim on the back.",
    price: "$35",
    badge: null,
    emoji: "\u{1F455}",
    category: "apparel",
    comingSoon: false,
  },
  {
    name: "Foodie Hoodie",
    tagline: "Oversized fit. Embroidered chopstick logo on chest.",
    price: "$65",
    badge: "DROP 2",
    emoji: "\u{1F9E5}",
    category: "apparel",
    comingSoon: true,
  },
  {
    name: "Chopstick Dad Hat",
    tagline: "Adjustable. Embroidered crossed chopsticks logo.",
    price: "$28",
    badge: null,
    emoji: "\u{1F9E2}",
    category: "apparel",
    comingSoon: true,
  },
];

const ORANGE = "#E8613C";
const GOLD = "#D4A853";
const CREAM = "#F5F0E8";
const BASE = "#050505";

const badgeColors = {
  "BEST SELLER": { bg: ORANGE, color: "#fff" },
  LIMITED: { bg: GOLD, color: "#1a1200" },
  NEW: { bg: "#2ecc71", color: "#fff" },
  "DROP 2": { bg: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" },
};

const categories = ["ALL", "ACCESSORIES", "APPAREL"];

function ProductCard({ product, onAdd, visible }) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const dimmed = product.comingSoon;
  const badge = product.badge ? badgeColors[product.badge] : null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        borderRadius: 16,
        background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        border: `1px solid ${hover && !dimmed ? "rgba(232,97,60,0.3)" : "rgba(255,255,255,0.06)"}`,
        padding: "28px 22px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform: visible
          ? hover && !dimmed ? "translateY(-6px)" : "translateY(0)"
          : "translateY(30px)",
        opacity: visible ? (dimmed ? 0.55 : 1) : 0,
        boxShadow: hover && !dimmed
          ? "0 12px 40px rgba(232,97,60,0.12), 0 0 20px rgba(232,97,60,0.06)"
          : "0 4px 20px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      {/* Badge */}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 10,
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            letterSpacing: 1,
            background: badge.bg,
            color: badge.color,
            textTransform: "uppercase",
          }}
        >
          {product.badge}
        </span>
      )}

      {/* Emoji circle */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle, rgba(232,97,60,0.1) 0%, rgba(212,168,83,0.05) 60%, transparent 100%)`,
          marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span style={{ fontSize: 52, lineHeight: 1 }}>{product.emoji}</span>
      </div>

      {/* Name */}
      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: CREAM,
          margin: "0 0 6px",
          textAlign: "center",
        }}
      >
        {product.name}
      </h3>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          color: "rgba(245,240,232,0.4)",
          margin: "0 0 16px",
          textAlign: "center",
          lineHeight: 1.45,
        }}
      >
        {product.tagline}
      </p>

      {/* Price */}
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 20,
          fontWeight: 700,
          color: CREAM,
          margin: "0 0 18px",
        }}
      >
        {product.price}
      </p>

      {/* Spacer to push button to bottom */}
      <div style={{ flex: 1 }} />

      {/* Coming Soon overlay + Notify button, or Add to Cart */}
      {product.comingSoon ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            background: "rgba(5,5,5,0.55)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22,
              letterSpacing: 3,
              color: CREAM,
              opacity: 0.8,
            }}
          >
            COMING SOON
          </span>
          <button
            style={{
              padding: "10px 28px",
              borderRadius: 8,
              border: `1px solid ${GOLD}`,
              background: "transparent",
              color: GOLD,
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(212,168,83,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            NOTIFY ME
          </button>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 10,
            border: "none",
            background: added ? "#2ecc71" : ORANGE,
            color: added ? "#fff" : CREAM,
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.5,
            cursor: "pointer",
            transition: "all 0.25s",
            transform: added ? "scale(0.97)" : "scale(1)",
          }}
          onMouseEnter={(e) => {
            if (!added) e.target.style.background = "#c94f2e";
          }}
          onMouseLeave={(e) => {
            if (!added) e.target.style.background = ORANGE;
          }}
        >
          {added ? "ADDED!" : "ADD TO CART"}
        </button>
      )}
    </div>
  );
}

export default function MerchShop() {
  const [filter, setFilter] = useState("ALL");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef({});

  const filtered =
    filter === "ALL"
      ? products
      : products.filter((p) => p.category === filter.toLowerCase());

  const handleAdd = useCallback(
    (product) => {
      setCart((prev) => [...prev, product.name]);
      setToast(product.name);
      setTimeout(() => setToast(null), 1500);
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(entry.target.dataset.idx));
          }
        });
      },
      { threshold: 0.15 },
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
  }, [filter]);

  return (
    <section
      id="merch"
      style={{
        position: "relative",
        padding: "64px 0 48px",
      }}
    >
      {/* Cart counter pill */}
      {cart.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 64,
            right: "clamp(0px, 2vw, 0px)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 20,
            background: "rgba(232,97,60,0.12)",
            border: `1px solid rgba(232,97,60,0.25)`,
            zIndex: 5,
          }}
        >
          <span style={{ fontSize: 14 }}>{"\u{1F6D2}"}</span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              color: CREAM,
            }}
          >
            {cart.length}
          </span>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            borderRadius: 12,
            background: "rgba(46,204,113,0.95)",
            color: "#fff",
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            zIndex: 100,
            animation: "merchToastIn 0.3s ease-out",
          }}
        >
          Added {toast}!
        </div>
      )}

      <style>{`
        @keyframes merchToastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        {/* Gold line */}
        <div
          style={{
            width: 60,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            margin: "0 auto 20px",
          }}
        />
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(48px, 10vw, 60px)",
            fontWeight: 400,
            color: CREAM,
            margin: "0 0 10px",
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          THE SHOP
        </h2>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            color: "rgba(245,240,232,0.4)",
            margin: 0,
            fontWeight: 400,
          }}
        >
          Rep the twins. Eat in style.
        </p>
      </div>

      {/* Filter pills */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 36,
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "8px 22px",
                borderRadius: 20,
                border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                background: active ? ORANGE : "transparent",
                color: active ? "#fff" : "rgba(245,240,232,0.45)",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "uppercase",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(12px, 3vw, 20px)",
        }}
        className="merch-grid"
      >
        {filtered.map((p, i) => {
          const key = `${p.name}-${filter}`;
          return (
            <div
              key={key}
              ref={(el) => { cardRefs.current[key] = el; }}
              data-idx={key}
            >
              <ProductCard
                product={p}
                onAdd={handleAdd}
                visible={visibleCards.has(key)}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <div style={{ textAlign: "center", marginTop: 44 }}>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: "rgba(245,240,232,0.25)",
            margin: "0 0 6px",
          }}
        >
          More drops coming soon. Follow for first access.
        </p>
        <a
          href="https://www.tiktok.com/@foodietwinzz"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: ORANGE,
            textDecoration: "none",
            fontWeight: 700,
            letterSpacing: 0.5,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { e.target.style.opacity = "0.7"; }}
          onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
        >
          @foodietwinzz
        </a>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        .merch-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        @media (max-width: 768px) {
          .merch-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .merch-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
