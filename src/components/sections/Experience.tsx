import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { experiences } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { TExperience } from "../../types";

const ExperienceCard: React.FC<TExperience> = (experience) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#4E4E50",
        color: "#F5F5F2",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
      }}
      contentArrowStyle={{ borderRight: "7px solid #4E4E50" }}
      date={experience.date}
      iconStyle={{
        background: experience.iconBg,
        border: "2px solid #C3073F",
        boxShadow: "0 0 16px rgba(195,7,63,0.3)",
      }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={experience.icon}
            alt={experience.companyName}
            className="h-[60%] w-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-[24px] font-bold" style={{ color: "#F5F5F2" }}>
          {experience.title}
        </h3>
        <p
          className="text-[16px] font-semibold"
          style={{ margin: 0, color: "#C3073F" }}
        >
          {experience.companyName}
        </p>
      </div>

      <ul className="ml-5 mt-5 list-disc space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="pl-1 text-[14px] tracking-wider"
            style={{ color: "#C8C8C8" }}
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <div className="flex flex-col">
        {/* Override react-vertical-timeline-component's default purple line colour */}
        <style>{`
          .vertical-timeline::before {
            background: linear-gradient(to bottom, #C3073F, rgba(195,7,63,0.12));
          }
          .vertical-timeline-element-date {
            color: #C8C8C8 !important;
            opacity: 1 !important;
          }
        `}</style>

        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
