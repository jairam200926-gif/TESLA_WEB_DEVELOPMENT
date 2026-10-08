import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { navLinks } from "../../constants";
import { menu, close } from "../../assets";
import navbarLogo from "../../assets/navbar-logo.png";

// ── Navbar logo ─────────────────────────────────────────────────────────────
const LenovoLOQLogo = ({ activeSection }: { activeSection: string }) => (
  <div className="relative flex-shrink-0 w-8 h-8">
    <motion.img
      key={activeSection}
      src={navbarLogo}
      alt="TWD logo"
      className="w-full h-full object-contain"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    />
  </div>
);

// ── Nav link with active highlight ─────────────────────────────────────────
const NavItem = ({
  nav,
  isActive,
}: {
  nav: { id: string; title: string };
  isActive: boolean;
}) => (
  <a
    href={`#${nav.id}`}
    className="relative block px-4 py-2 rounded-full text-[16px] font-semibold whitespace-nowrap transition-all duration-300 group"
    style={{ color: isActive ? "#F5F5F2" : "#C8C8C8" }}
  >
    {/* Active pill */}
    {isActive && (
      <motion.span
        layoutId="active-pill"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(195,7,63,0.9), rgba(149,7,64,0.82))",
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 18px rgba(195,7,63,0.28)",
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
      />
    )}

    {/* Hover highlight (not active) */}
    {!isActive && (
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
    )}

    <span className="relative z-10 group-hover:text-white transition-colors duration-200">
      {nav.title}
    </span>
  </a>
);

// ── Main Navbar ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isHero, setIsHero] = useState(true);
  const [toggle, setToggle] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // ── Scroll-tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setIsHero(window.scrollY < 60);
      const sectionStates = [
        { id: "about", state: "about" },
        { id: "work", state: "work" },
        { id: "tech", state: "services" },
        { id: "services", state: "services" },
        { id: "projects", state: "projects" },
        { id: "contact", state: "contact" },
      ];
      let current = "home";
      const activationPoint = window.innerHeight * 0.65;

      for (const { id, state } of sectionStates) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= activationPoint && r.bottom > 0) current = state;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Animated shimmer / moving highlight across glass ─────────────────────
  useEffect(() => {
    if (!glowRef.current) return;
    let pos = 0;
    let dir = 1;
    let raf: number;
    const animate = () => {
      pos += 0.12 * dir;
      if (pos > 100) dir = -1;
      if (pos < 0) dir = 1;
      if (glowRef.current) {
        glowRef.current.style.background = `linear-gradient(
          90deg,
          transparent ${pos - 15}%,
          rgba(255,255,255,0.07) ${pos}%,
          transparent ${pos + 15}%
        )`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Visible nav links per section ────────────────────────────────────────
  const getVisibleLinks = () => {
    switch (activeSection) {
      case "about":    return navLinks.filter(l => l.id !== "about");
      case "work":     return navLinks.filter(l => l.id !== "about" && l.id !== "work");
      case "services": return navLinks.filter(l => !["about", "work", "services"].includes(l.id));
      case "projects": return navLinks.filter(l => l.id === "contact");
      case "contact":  return [];
      default:         return navLinks;
    }
  };
  const visibleLinks = getVisibleLinks();
  const desktopLinks = isHero
    ? navLinks.filter((link) => link.id !== "contact")
    : visibleLinks;
  const mobileLinks = isHero ? navLinks : visibleLinks;

  // ── Border glow intensity by section ─────────────────────────────────────
  const borderOpacity = activeSection === "contact" ? 0.6 : 0.25;

  return (
    <>
      {/* Scoped CSS for orange glow pulse */}
      <style>{`
        @keyframes navGlowPulse {
          0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(0,0,0,0.32), 0 16px 42px rgba(0,0,0,0.42), 0 0 20px rgba(195,7,63,0.14); }
          50%       { box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.32), 0 18px 46px rgba(0,0,0,0.48), 0 0 32px rgba(195,7,63,0.25); }
        }
        .nav-glow-pulse { animation: navGlowPulse 3.5s ease-in-out infinite; }
      `}</style>

      {/* Fixed outer wrapper — never participates in page layout */}
      <div
        className={`fixed inset-x-0 z-[9999] flex justify-center pointer-events-none transition-all duration-500 ${
          isHero ? "top-3 px-4" : "top-4 sm:top-6 px-4"
        }`}
        style={{ isolation: "isolate" }}
      >
        {/* ── ONE unified glass container ───────────────────────────────── */}
        <motion.nav
          ref={navRef}
          layout
            animate={{ y: isHero ? 0 : 2, scale: isHero ? 1 : 0.985 }}
            whileHover={{ y: isHero ? -2 : 0 }}
            transition={{
              layout: { type: "spring", stiffness: 260, damping: 28, mass: 0.7 },
              y: { type: "spring", stiffness: 300, damping: 28, mass: 0.65 },
              scale: { type: "spring", stiffness: 260, damping: 30, mass: 0.7 },
            }}
          className={`nav-glow-pulse pointer-events-auto relative flex items-center gap-2 sm:gap-4 overflow-hidden transition-all duration-500 ${
            isHero
              ? "w-full min-h-[80px] rounded-full px-5 py-4 sm:min-h-[96px] sm:px-12 sm:py-5"
              : "rounded-full px-3 py-2 sm:px-5"
          }`}
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.12) 0%, rgba(195,7,63,0.16) 22%, rgba(78,78,80,0.72) 54%, rgba(255,255,255,0.06) 100%)",
            backdropFilter: "blur(28px) saturate(165%)",
            WebkitBackdropFilter: "blur(28px) saturate(165%)",
            border: isHero
              ? "1px solid rgba(255,255,255,0.16)"
              : `1px solid rgba(255, 255, 255, ${0.16 + borderOpacity * 0.25})`,
            borderBottom: isHero ? "1px solid rgba(255,255,255,0.2)" : undefined,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(0,0,0,0.32), 0 16px 42px rgba(0,0,0,0.42), 0 0 26px rgba(195,7,63,0.14)",
            willChange: "width",
          }}
        >
          {/* Moving shimmer highlight */}
          <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{ zIndex: 0 }}
          />

          {/* Top-edge reflection line */}
          <div
            className="absolute inset-x-6 top-0 h-[1px] pointer-events-none rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 50%, transparent)",
              zIndex: 1,
            }}
          />

          {/* ── BRAND ─────────────────────────────────────────────────── */}
          <Link
            to="/"
            className="relative z-10 flex items-center gap-2 flex-shrink-0 group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {isHero ? (
              <img
                src={navbarLogo}
                alt="Tesla logo"
                className="h-10 w-10 object-contain"
              />
            ) : (
              <LenovoLOQLogo activeSection={activeSection} />
            )}
            <motion.span
              className={`font-extrabold tracking-wider transition-colors duration-200 ${
                isHero ? "text-[24px] sm:text-[28px]" : "text-[16px] sm:text-[17px]"
              }`}
              style={{ color: "#F2F2F2" }}
              whileHover={{ color: "#C3073F" }}
            >
              {isHero ? "TESLA." : "TWD"}
            </motion.span>
          </Link>

          {/* ── DESKTOP: divider + nav items ──────────────────────────── */}
          <AnimatePresence initial={false}>
            {desktopLinks.length > 0 && (
              <motion.div
                key="desktop-nav"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`z-10 hidden sm:flex items-center gap-1 overflow-hidden flex-shrink-0 ${
                  isHero ? "absolute left-1/2 -translate-x-1/2" : "relative"
                }`}
              >
                {/* Vertical separator */}
                {!isHero && <div
                  className="h-4 w-px mx-1 flex-shrink-0"
                  style={{ background: "rgba(195,7,63,0.36)" }}
                />}

                {/* Nav items — rendered as a stable block, no independent layout */}
                <ul className="flex items-center gap-0.5 list-none">
                  {desktopLinks.map((nav) => (
                    <li key={nav.id}>
                      <NavItem
                        nav={nav}
                        isActive={activeSection === nav.id}
                      />
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {isHero && (
            <a
              href="#contact"
              className="relative z-10 ml-auto hidden rounded-full border border-white/20 px-6 py-3 text-sm font-extrabold text-white transition-colors duration-200 hover:border-[#C3073F] hover:text-[#C3073F] sm:block"
              style={{
                background: "rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              LET&apos;S TALK
            </a>
          )}

          {/* ── MOBILE: hamburger + dropdown ──────────────────────────── */}
          {mobileLinks.length > 0 && (
            <div className="relative z-10 flex sm:hidden items-center flex-shrink-0">
              <motion.button
                onClick={() => setToggle(!toggle)}
                aria-label="Toggle navigation"
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: "rgba(195,7,63,0.1)",
                  border: "1px solid rgba(195,7,63,0.32)",
                }}
              >
                <img
                  src={toggle ? close : menu}
                  alt="menu"
                  className="w-4 h-4 object-contain"
                  style={{ filter: "invert(1)" }}
                />
              </motion.button>

              {/* Mobile dropdown — anchored below navbar */}
              <AnimatePresence>
                {toggle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="absolute right-0 top-[calc(100%+10px)] min-w-[160px] p-2.5 rounded-2xl overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(10,10,10,0.78))",
                      backdropFilter: "blur(28px) saturate(160%)",
                      WebkitBackdropFilter: "blur(28px) saturate(160%)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.18), 0 16px 48px rgba(0,0,0,0.8), 0 0 20px rgba(195,7,63,0.18)",
                    }}
                  >
                    <ul className="flex flex-col gap-1 list-none">
                      {mobileLinks.map((nav) => (
                        <li key={nav.id}>
                          <a
                            href={`#${nav.id}`}
                            onClick={() => setToggle(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                            style={{
                              color:
                                activeSection === nav.id ? "#F5F5F2" : "#C8C8C8",
                              background:
                                activeSection === nav.id
                                  ? "rgba(195,7,63,0.2)"
                                  : "transparent",
                            }}
                          >
                            {activeSection === nav.id && (
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: "#C3073F" }}
                              />
                            )}
                            {nav.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.nav>
      </div>
    </>
  );
};

export default Navbar;
