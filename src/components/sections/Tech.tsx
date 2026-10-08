import { SectionWrapper } from "../../hoc";
import { usePortfolioData } from "../../admin/portfolioData";

const Tech = () => {
  const { technologies: savedTechnologies } = usePortfolioData();

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C3073F]">Skills & tools</p>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><h2 className="text-4xl font-bold tracking-[-0.05em] text-[#F5F5F2] sm:text-6xl">The tools behind the work.</h2><p className="max-w-sm text-sm leading-6 text-[#8D8D8D]">A practical, evolving stack for data-rich products and thoughtful interfaces.</p></div>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {savedTechnologies.map((technology) => (
          <div className="premium-card group flex min-h-[150px] flex-col justify-between rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C3073F]/40" key={technology.name}>
            <img src={technology.icon} alt="" className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110" />
            <p className="text-sm font-semibold text-[#F5F5F2]">{technology.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
