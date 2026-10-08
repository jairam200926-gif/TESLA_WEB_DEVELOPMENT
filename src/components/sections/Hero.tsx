import { styles } from "../../constants/styles";
import { HeroBg } from "../canvas";
import { usePortfolioData } from "../../admin/portfolioData";
import { profile } from "../../assets";

const Hero = () => {
  const { hero } = usePortfolioData();

  return (
    <section className={`relative mx-auto h-screen w-full overflow-hidden`}>
      {/* Animated orange plexus background */}
      <HeroBg />

      {/* Hero content */}
      <div className={`absolute inset-0 z-10 mx-auto max-w-[1800px] ${styles.paddingX} pb-5 pt-32 sm:pt-36`}>
        <div className="relative grid h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111]/90 shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-sm lg:grid-cols-[0.92fr_0.82fr_0.86fr]">
          <div className="pointer-events-auto relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#950740]">Data science · software</p>
            <h1 className="mt-5 text-[clamp(3.1rem,5vw,6rem)] font-black leading-[0.92] tracking-[-0.05em] text-white">
              {hero.name}<br />is right<br /><span className="text-[#C3073F]">here.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-[#D9D9D9] sm:text-lg">
              {hero.lines[0]} {hero.lines[1]}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#projects" className="bg-[#C3073F] px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#950740]">Explore work</a>
              <a href="#contact" className="group flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-white"><span className="text-xl text-[#950740] transition-transform group-hover:translate-x-1">↗</span> Get in touch</a>
            </div>
            <div className="mt-10 flex gap-9 text-sm">
              <div><p className="text-2xl font-black text-[#950740]">DATA</p><p className="mt-1 text-white/50">Analytics</p></div>
              <div><p className="text-2xl font-black text-[#950740]">CODE</p><p className="mt-1 text-white/50">Systems</p></div>
            </div>
          </div>

          <div className="pointer-events-none relative hidden overflow-hidden lg:block">
            <div className="absolute inset-x-0 bottom-0 h-[76%] rounded-t-full bg-[radial-gradient(circle_at_50%_28%,rgba(195,7,63,0.28),rgba(0,0,0,0)_68%)]" />
            <img src={profile} alt="Professional portrait" className="absolute inset-x-0 bottom-0 h-[94%] w-full object-cover object-top grayscale contrast-110" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111111] to-transparent" />
          </div>

          <div className="relative z-10 hidden flex-col justify-center gap-9 border-l border-white/10 p-10 lg:flex">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#950740]">01 / Data analytics</p><p className="mt-3 text-sm leading-relaxed text-white/65">Turning complex data into clear, actionable insights and practical tools.</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#950740]">02 / Web systems</p><p className="mt-3 text-sm leading-relaxed text-white/65">Building responsive web experiences that stay useful, focused, and fast.</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#950740]">03 / AI solutions</p><p className="mt-3 text-sm leading-relaxed text-white/65">Exploring intelligent workflows that help people make better decisions.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
