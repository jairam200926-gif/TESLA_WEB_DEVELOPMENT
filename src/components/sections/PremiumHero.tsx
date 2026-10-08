import { motion } from "framer-motion";

import { styles } from "../../constants/styles";
import { usePortfolioData } from "../../admin/portfolioData";
import heroBackgroundCutout from "../../assets/hero-background-cutout.png";
import navbarLogo from "../../assets/navbar-logo.png";

const PremiumHero = () => {
  const { hero } = usePortfolioData();

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-[#1A1A1D] pt-24 sm:min-h-screen sm:pt-28">
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 82% 18%, rgba(195,7,63,0.16), transparent 26%), radial-gradient(circle at 12% 80%, rgba(111,34,50,0.16), transparent 28%)" }} />
      <img
        src={heroBackgroundCutout}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-[-4%] z-0 h-[32%] max-w-[58vw] object-contain object-right-bottom opacity-25 sm:bottom-4 sm:right-0 sm:h-[calc(100%-3.5rem)] sm:max-w-[60vw] sm:opacity-65 lg:max-w-[54vw] lg:opacity-100"
      />
      <div className={`relative z-10 mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl items-center ${styles.paddingX} pb-10 sm:min-h-[calc(100vh-7rem)] sm:pb-14`}>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="hero-display mt-4 max-w-[19rem] text-[clamp(3rem,12vw,7.4rem)] font-bold leading-[0.88] tracking-[-0.075em] text-[#F5F5F2] sm:mt-8 sm:max-w-3xl">
            Ideas into <span className="text-[#C3073F]">intelligent</span>{" "}
            <span className="whitespace-nowrap">
              {"pr"}
              <motion.span
                className="inline-flex h-[0.58em] w-[0.58em] align-[-0.03em]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              >
                <img src={navbarLogo} alt="o" className="h-full w-full scale-[1.6] object-contain" />
              </motion.span>
              {"ducts."}
            </span>
          </h1>
          <p className="mt-6 max-w-[19rem] text-base leading-7 text-[#C8C8C8] sm:mt-8 sm:max-w-xl sm:text-lg sm:leading-8">{hero.lines[0]} {hero.lines[1]}</p>
          <div className="mt-7 flex flex-nowrap gap-3 sm:mt-9 sm:flex-wrap sm:gap-4"><a href="#projects" className="whitespace-nowrap rounded-full bg-[#C3073F] px-4 py-3 text-xs font-bold text-[#F5F5F2] transition-all hover:-translate-y-1 hover:bg-[#950740] sm:px-6 sm:py-3.5 sm:text-sm">Explore selected work</a><button type="button" onClick={() => window.dispatchEvent(new Event("open-project-inquiry"))} className="whitespace-nowrap rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-[#F5F5F2] transition-colors hover:border-[#C3073F] hover:text-[#C3073F] sm:px-6 sm:py-3.5 sm:text-sm">Start a project ↗</button></div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumHero;
