import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { github } from "../../assets";
import { SectionWrapper } from "../../hoc";
import { fadeIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { TProject } from "../../types";
import { usePortfolioData } from "../../admin/portfolioData";

const ProjectCard: React.FC<{ index: number } & TProject> = ({
  index,
  name,
  subtitle,
  description,
  featureLabel,
  features,
  stack,
  tags,
  image,
  sourceCodeLink,
  liveLink,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        glareEnable
        tiltEnable
        tiltMaxAngleX={30}
        tiltMaxAngleY={30}
        glareColor="#C3073F"
      >
        <div className="premium-card w-full rounded-3xl p-4 sm:w-[330px]">
          <div className="relative h-[230px] w-full">
            <img
              src={image}
              alt={name}
              className="h-full w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="card-img_hover absolute inset-0 m-3 flex justify-end">
              <div
                onClick={() => window.open(sourceCodeLink, "_blank")}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#1A1A1D]/85"
              >
                <img
                  src={github}
                  alt="github"
                  className="h-1/2 w-1/2 object-contain"
                />
              <div className="absolute inset-0 rounded-2xl bg-black/25 pointer-events-none"></div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-[24px] font-bold text-[#F5F5F2]">{name}</h3>
            {subtitle && <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#C3073F]">{subtitle}</p>}
            <p className="mt-2 text-[14px] leading-6 text-[#C8C8C8]">{description}</p>
          </div>
          {features && features.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F5F5F2]">{featureLabel ?? "Features"}</p>
              <ul className="mt-3 space-y-1.5 text-sm leading-5 text-[#C8C8C8]">
                {features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-[#C3073F]">•</span><span>{feature}</span></li>)}
              </ul>
            </div>
          )}
          {stack && stack.length > 0 && <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-[#C8C8C8]"><span className="font-bold text-[#F5F5F2]">Built with: </span>{stack.join(" • ")}</p>}
          {liveLink && <a href={liveLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border border-[#C3073F]/60 px-4 py-2 text-xs font-bold text-[#F5F5F2] transition-colors hover:bg-[#C3073F]">View live demo ↗</a>}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[14px] ${tag.color}`}>
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const { projects: savedProjects } = usePortfolioData();

  return (
    <>
      <Header useMotion={true} {...config.sections.works} />

      <div className="flex w-full">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 max-w-3xl text-[17px] leading-[30px] text-[#C8C8C8]"
        >
          {config.sections.works.content}
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-7">
        {savedProjects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
