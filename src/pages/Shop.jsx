import React, { useState, useEffect, useRef, useCallback } from "react";

const products = [
  { id: 1, name: "Signature Chopsticks", tagline: "Engraved bamboo with burnt orange tips. The original.", price: 18, badge: "BEST SELLER", emoji: "\u{1F962}", category: "accessories", comingSoon: false },
  { id: 2, name: "Premium Metal Chopsticks", tagline: "Stainless steel. Gold-tipped. For the real ones.", price: 32, badge: "LIMITED", emoji: "\u2728", category: "accessories", comingSoon: false },
  { id: 3, name: "Chopstick + Ramen Bowl Set", tagline: "Branded ceramic bowl with matching chopsticks & spoon.", price: 45, badge: "NEW", emoji: "\u{1F35C}", category: "accessories", comingSoon: false },
  { id: 4, name: "Chopstick Travel Case", tagline: "Leather snap case. Take your sticks everywhere.", price: 14, badge: null, emoji: "\u{1F9F3}", category: "accessories", comingSoon: false },
  { id: 5, name: "Classic Logo Tee", tagline: "Heavyweight cotton. FoodieTwinzz front, Anaheim back.", price: 35, badge: null, emoji: "\u{1F455}", category: "apparel", comingSoon: false },
  { id: 6, name: "Foodie Hoodie", tagline: "Oversized fit. Embroidered chopstick logo on chest.", price: 65, badge: "DROP 2", emoji: "\u{1F9E5}", category: "apparel", comingSoon: true },
  { id: 7, name: "Chopstick Dad Hat", tagline: "Adjustable. Embroidered crossed chopsticks.", price: 28, badge: null, emoji: "\u{1F9E2}", category: "apparel", comingSoon: true },
  { id: 8, name: "Foodie Apron", tagline: "Canvas apron with FoodieTwinzz branding.", price: 30, badge: null, emoji: "\u{1F468}\u200D\u{1F373}", category: "apparel", comingSoon: true },
];

const categories = [
  { key: "all", label: "ALL" },
  { key: "accessories", label: "CHOPSTICKS & BOWLS" },
  { key: "apparel", label: "APPAREL" },
];

const badgeStyles = {
  "BEST SELLER": { background: "var(--orange)", color: "var(--bg)" },
  LIMITED: { background: "var(--gold)", color: "var(--bg)" },
  NEW: { background: "var(--green)", color: "var(--bg)" },
  "DROP 2": { background: "var(--surface)", color: "var(--cream-muted)", border: "1px dashed var(--cream-dim)" },
};

function ProductCard({ product, onAdd, addedId }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isAdded = addedId === product.id;
  const badge = product.badge ? badgeStyles[product.badge] || {} : null;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "var(--surface)",
        border: `1px solid ${hovered && !product.comingSoon ? "rgba(212,168,83,0.25)" : "var(--cream-dim)"}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: hovered && !product.comingSoon ? "translateY(-6px)" : "none",
        boxShadow: hovered && !product.comingSoon ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
        opacity: visible ? 1 : 0,
        willChange: "transform, opacity",
      }}
    >
      {/* Image area */}
      <div style={{
        aspectRatio: "1/1",
        background: "var(--surface-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: "radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)",
      }}>
        <span style={{ fontSize: 64, lineHeight: 1 }}>{product.emoji}</span>
        {product.badge && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 1.5,
            padding: "4px 12px", borderRadius: 20,
            ...badge,
          }}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: 20 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600, color: "var(--cream)" }}>
          {product.name}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-muted)", marginTop: 4, lineHeight: 1.4 }}>
          {product.tagline}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>
            ${product.price}
          </span>
          {!product.comingSoon ? (
            <button
              onClick={() => onAdd(product)}
              style={{
                fontFamily: "var(--font-display)", fontSize: 12, letterSpacing: 1.5,
                padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                background: isAdded ? "var(--green)" : "var(--orange)",
                color: "var(--bg)",
                transition: "all 0.2s",
                transform: hovered ? "scale(1.02)" : "none",
                filter: hovered ? "brightness(1.15)" : "none",
              }}
            >
              {isAdded ? "ADDED \u2713" : "ADD TO CART"}
            </button>
          ) : (
            <button style={{
              fontFamily: "var(--font-display)", fontSize: 12, letterSpacing: 1.5,
              padding: "8px 16px", borderRadius: 6, cursor: "pointer",
              border: "1px solid var(--cream-dim)", color: "var(--cream-muted)",
              background: "transparent", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--cream-dim)"; e.currentTarget.style.color = "var(--cream-muted)"; }}
            >
              NOTIFY ME
            </button>
          )}
        </div>
      </div>

      {/* Coming Soon overlay */}
      {product.comingSoon && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(5,5,5,0.6)",
          backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
          borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 3, color: "var(--cream-muted)" }}>
            COMING SOON
          </span>
        </div>
      )}
    </div>
  );
}

function CartDrawer({ cart, open, onClose, onUpdate, onRemove, onClear }) {
  const total = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
  const count = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 1000, transition: "opacity 0.3s",
          }}
        />
      )}
      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, width: "min(380px, 100%)", height: "100vh",
        zIndex: 1001, background: "var(--surface)",
        borderLeft: "1px solid var(--cream-dim)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: 24, borderBottom: "1px solid var(--cream-dim)", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2, color: "var(--cream)" }}>
            YOUR CART {count > 0 && `(${count})`}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "var(--cream-muted)",
              fontSize: 22, cursor: "pointer", padding: "4px 8px", lineHeight: 1,
            }}
          >
            \u2715
          </button>
        </div>

        {/* Body */}
        {cart.length === 0 ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--cream-muted)" }}>
              Your cart is empty
            </span>
            <button
              onClick={onClose}
              style={{
                fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: 1.5,
                padding: "10px 24px", borderRadius: 6, cursor: "pointer",
                border: "1px solid var(--cream-dim)", background: "transparent",
                color: "var(--cream-muted)", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--cream-dim)"; e.currentTarget.style.color = "var(--cream-muted)"; }}
            >
              BROWSE PRODUCTS
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
            {cart.map((item, i) => (
              <div key={item.product.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "16px 0",
                borderBottom: i < cart.length - 1 ? "1px solid var(--cream-dim)" : "none",
              }}>
                <span style={{ fontSize: 32, flexShrink: 0, width: 40, textAlign: "center" }}>{item.product.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--cream)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.product.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <button
                      onClick={() => onUpdate(item.product.id, -1)}
                      style={{
                        width: 26, height: 26, borderRadius: 6, border: "1px solid var(--cream-dim)",
                        background: "transparent", color: "var(--cream-muted)", fontFamily: "var(--font-mono)",
                        fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 0, lineHeight: 1,
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--cream)", minWidth: 16, textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdate(item.product.id, 1)}
                      style={{
                        width: 26, height: 26, borderRadius: 6, border: "1px solid var(--cream-dim)",
                        background: "transparent", color: "var(--cream-muted)", fontFamily: "var(--font-mono)",
                        fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 0, lineHeight: 1,
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>
                  ${item.product.price * item.quantity}
                </span>
                <button
                  onClick={() => onRemove(item.product.id)}
                  style={{
                    background: "none", border: "none", color: "var(--cream-dim)",
                    fontSize: 16, cursor: "pointer", padding: "4px", flexShrink: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--orange)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cream-dim)"; }}
                >
                  \u2715
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            flexShrink: 0, padding: 24,
            borderTop: "1px solid var(--cream-dim)", background: "var(--surface)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--cream-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
                TOTAL
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>
                ${total}
              </span>
            </div>
            <button
              onClick={() => alert("Coming soon! Follow @foodietwinzz for drop updates.")}
              style={{
                width: "100%", padding: 16, borderRadius: 8, border: "none",
                background: "var(--gold)", color: "var(--bg)",
                fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 2,
                cursor: "pointer", transition: "filter 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
            >
              CHECKOUT
            </button>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={onClear}
                style={{
                  background: "none", border: "none",
                  fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--cream-muted)",
                  cursor: "pointer", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--orange)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cream-muted)"; }}
              >
                CLEAR CART
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function Shop() {
  const [activeTab, setActiveTab] = useState("all");
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [fadeKey, setFadeKey] = useState(0);
  const timerRef = useRef(null);

  const filtered = activeTab === "all" ? products : products.filter((p) => p.category === activeTab);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);

  const addToCart = useCallback((product) => {
    if (product.comingSoon) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) return prev.map((c) => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { product, quantity: 1 }];
    });
    setAddedId(product.id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAddedId(null), 1500);
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCart((prev) => prev.map((c) => {
      if (c.product.id !== id) return c;
      const newQty = c.quantity + delta;
      return newQty <= 0 ? null : { ...c, quantity: newQty };
    }).filter(Boolean));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((c) => c.product.id !== id));
  }, []);

  const switchTab = (key) => {
    setActiveTab(key);
    setFadeKey((k) => k + 1);
  };

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Page Header */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "120px 20px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20,
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(48px,8vw,72px)",
            color: "var(--cream)", margin: 0, lineHeight: 1, letterSpacing: 2,
          }}>
            THE SHOP
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 17, color: "rgba(245,240,232,0.6)",
            margin: "12px 0 0", maxWidth: 500, lineHeight: 1.5,
          }}>
            Rep the twins. Eat in style.
          </p>
        </div>

        {/* Cart pill */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 24, cursor: "pointer",
            background: "var(--surface)", border: "1px solid var(--cream-dim)",
            transition: "border-color 0.2s", flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
        >
          <span style={{ fontSize: 16 }}>{"\u{1F6D2}"}</span>
          {cartCount > 0 ? (
            <>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--cream)" }}>
                {cartCount}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--gold)" }}>
                ${cartTotal}
              </span>
            </>
          ) : (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--cream-muted)" }}>
              Empty
            </span>
          )}
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((cat) => {
            const active = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => switchTab(cat.key)}
                style={{
                  fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: 1.5,
                  padding: "10px 22px", borderRadius: 8, cursor: "pointer",
                  border: active ? "none" : "1px solid var(--cream-dim)",
                  background: active ? "var(--gold)" : "transparent",
                  color: active ? "var(--bg)" : "var(--cream-muted)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--gold)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--cream-dim)"; }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div
        key={fadeKey}
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "24px 20px 100px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
          animation: "fadeIn 0.35s ease-out",
        }}
      >
        {filtered.map((p, i) => (
          <div key={p.id} style={{ animationDelay: `${i * 0.04}s` }}>
            <ProductCard product={p} onAdd={addToCart} addedId={addedId} />
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={updateQuantity}
        onRemove={removeFromCart}
        onClear={() => setCart([])}
      />
    </div>
  );
}
