import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { creator, python, web } from "../../assets";
import { SectionWrapper } from "../../hoc";

const services = [
  {
    number: "01",
    title: "Python development",
    body: "Applications, automation tools, data-processing systems, and backend logic built with Python.",
    icon: python,
  },
  {
    number: "02",
    title: "Data science",
    body: "Cleaning, analysing, visualising, and extracting useful insight from real-world datasets.",
    icon: web,
  },
  {
    number: "03",
    title: "AI applications",
    body: "Practical AI-powered assistants, APIs, and experiments designed around useful everyday decisions.",
    icon: creator,
  },
];

const Services = () => (
  <>
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C3073F]">Services</p>
      <h2 className="max-w-2xl text-4xl font-bold tracking-[-0.05em] text-[#F5F5F2] sm:text-6xl">
        Building practical software with purpose.
      </h2>
      <p className="max-w-xl text-sm leading-6 text-[#C8C8C8]">
        From data and AI to full-stack prototypes, every project is made to be clear, useful, and testable.
      </p>
    </div>

    <style>{`
      #services .vertical-timeline::before {
        background: linear-gradient(to bottom, #C3073F, rgba(111,34,50,0.18));
      }
      #services .vertical-timeline-element-date {
        color: #C8C8C8 !important;
        opacity: 1 !important;
        font-weight: 600;
      }
    `}</style>

    <VerticalTimeline>
      {services.map((service) => (
        <VerticalTimelineElement
          key={service.number}
          date={service.number}
          contentStyle={{
            background: "#4E4E50",
            color: "#F5F5F2",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
          }}
          contentArrowStyle={{ borderRight: "7px solid #4E4E50" }}
          iconStyle={{
            background: "#1A1A1D",
            border: "2px solid #C3073F",
            boxShadow: "0 0 16px rgba(195,7,63,0.3)",
          }}
          icon={<span className="flex h-full w-full items-center justify-center"><img src={service.icon} alt="" className="h-[58%] w-[58%] object-contain" /></span>}
        >
          <h3 className="text-2xl font-bold text-[#F5F5F2]">{service.title}</h3>
          <p className="mt-4 text-[15px] leading-7 text-[#C8C8C8]">{service.body}</p>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  </>
);

export default SectionWrapper(Services, "services");
