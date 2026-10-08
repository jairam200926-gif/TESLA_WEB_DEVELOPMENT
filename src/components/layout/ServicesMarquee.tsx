const services = [
  "DATA SCIENCE",
  "MACHINE LEARNING",
  "WEB DEVELOPMENT",
  "FINTECH",
  "AI SYSTEMS",
];

const ServicesMarquee = () => {
  const items = [...services, ...services];

  return (
    <section
      aria-label="Portfolio services"
      className="relative z-10 overflow-hidden border-y border-white/10 bg-[#4E4E50] py-5"
    >
      <style>{`
        @keyframes servicesMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .services-marquee-track {
          animation: servicesMarquee 24s linear infinite;
        }
        .services-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .services-marquee-track { animation: none; }
        }
      `}</style>
      <div className="services-marquee-track flex w-max items-center whitespace-nowrap">
        {items.map((service, index) => (
          <div key={`${service}-${index}`} className="flex items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
            <span className="text-sm font-semibold tracking-[0.18em] text-[#D9D9D9] sm:text-xl">
              {service}
            </span>
            <span aria-hidden="true" className="text-xl text-[#C3073F] sm:text-2xl">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesMarquee;
