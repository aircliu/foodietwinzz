import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Challenge", path: "/challenge" },
  { label: "Shop", path: "/shop" },
  { label: "Community", path: "/community" },
  { label: "Contact", path: "/contact" },
];

const FOOTER_PAGES = [
  { label: "Home", path: "/" },
  ...NAV_LINKS,
];

const SOCIALS = [
  { label: "TikTok", url: "https://www.tiktok.com/@foodietwinzz" },
  { label: "Instagram", url: "https://www.instagram.com/foodietwinzz" },
  { label: "YouTube", url: "#" },
];

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-link:hover { color: var(--cream) !important; }
        .nav-link-active { color: var(--orange) !important; }
        .follow-btn:hover {
          background: var(--orange) !important;
          color: var(--cream) !important;
          border-color: var(--orange) !important;
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .nav-mobile-overlay { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 5vw, 48px)",
        background: scrolled ? "rgba(5,5,5,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(245,240,232,0.06)" : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(18px, 4.5vw, 22px)",
          letterSpacing: 3,
          color: "var(--cream)",
          lineHeight: 1,
        }}>
          FOODIETWINZZ
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? "nav-link-active" : ""}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: isActive(link.path) ? "var(--orange)" : "var(--cream-muted)",
                transition: "color 0.3s ease",
                position: "relative",
                paddingBottom: 4,
              }}
            >
              {link.label}
              {isActive(link.path) && (
                <span style={{
                  position: "absolute",
                  bottom: -2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--orange)",
                }} />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop follow button */}
        <a
          href="https://www.tiktok.com/@foodietwinzz"
          target="_blank"
          rel="noopener noreferrer"
          className="follow-btn nav-desktop"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            letterSpacing: 2,
            padding: "8px 20px",
            borderRadius: 24,
            border: "1px solid var(--orange)",
            color: "var(--orange)",
            background: "transparent",
            transition: "all 0.3s ease",
          }}
        >
          FOLLOW
        </a>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          style={{
            display: "none",
            flexDirection: "column",
            gap: 5,
            padding: 8,
            zIndex: 1001,
            cursor: "pointer",
            background: "none",
            border: "none",
          }}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <div style={{
            width: 22, height: 1.5, background: "var(--cream)", borderRadius: 1,
            transition: "all 0.3s ease",
            transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
          }} />
          <div style={{
            width: 22, height: 1.5, background: "var(--cream)", borderRadius: 1,
            transition: "all 0.3s ease",
            opacity: menuOpen ? 0 : 1,
            transform: menuOpen ? "scaleX(0)" : "none",
          }} />
          <div style={{
            width: 22, height: 1.5, background: "var(--cream)", borderRadius: 1,
            transition: "all 0.3s ease",
            transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
          }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="nav-mobile-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      >
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 48,
              letterSpacing: 4,
              color: isActive(link.path) ? "var(--orange)" : "var(--cream)",
              transition: "color 0.3s ease",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transitionDelay: menuOpen ? `${0.05 + i * 0.06}s` : "0s",
              transitionProperty: "opacity, transform, color",
              transitionDuration: "0.4s",
              transitionTimingFunction: "ease",
            }}
          >
            {link.label.toUpperCase()}
          </Link>
        ))}
        <a
          href="https://www.tiktok.com/@foodietwinzz"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 16,
            fontFamily: "var(--font-display)",
            fontSize: 16,
            letterSpacing: 2,
            padding: "12px 32px",
            borderRadius: 24,
            border: "1px solid var(--orange)",
            color: "var(--orange)",
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
            transitionDelay: menuOpen ? `${0.05 + NAV_LINKS.length * 0.06}s` : "0s",
            transitionProperty: "opacity, transform",
            transitionDuration: "0.4s",
            transitionTimingFunction: "ease",
          }}
        >
          FOLLOW
        </a>
      </div>
    </>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{
      padding: "80px clamp(16px, 5vw, 40px) 40px",
      maxWidth: 1200,
      margin: "0 auto",
    }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
        }
        .footer-link:hover { color: var(--cream) !important; }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
      `}</style>

      <div className="footer-grid">
        {/* Brand */}
        <div>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            letterSpacing: 4,
            color: "var(--cream)",
            marginBottom: 12,
            lineHeight: 1,
          }}>
            FOODIETWINZZ
          </p>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--cream-muted)",
            lineHeight: 1.6,
            maxWidth: 280,
          }}>
            Twin food reviewers taking on Anaheim's best restaurants, one milestone at a time.
          </p>
        </div>

        {/* Pages */}
        <div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            color: "var(--cream-muted)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}>
            Pages
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FOOTER_PAGES.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="footer-link"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--cream-muted)",
                  transition: "color 0.3s ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Socials */}
        <div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            color: "var(--cream-muted)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}>
            Socials
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--cream-muted)",
                  transition: "color 0.3s ease",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: "rgba(245,240,232,0.06)",
        margin: "40px 0 24px",
      }} />

      {/* Bottom row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--cream-muted)",
        }}>
          &copy; 2025 FoodieTwinzz. All rights reserved.
        </p>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "rgba(245,240,232,0.5)",
        }}>
          Made with 🥢 in Anaheim
        </p>
      </div>
    </footer>
  );
}

/* ─── Layout ─── */
export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
