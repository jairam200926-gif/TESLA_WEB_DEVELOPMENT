import { motion } from "framer-motion";

import { fadeIn } from "../../utils/motion";
import { testimonials } from "../../constants";
import { TTestimonial } from "../../types";

const FeedbackCard: React.FC<{ index: number } & TTestimonial> = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="premium-card xs:w-[420px] w-full rounded-3xl p-8"
  >
    <p className="text-[48px] font-black text-[#C3073F]">“</p>

    <div className="mt-1">
      <p className="text-[18px] leading-8 tracking-wide text-[#F5F5F2]">{testimonial}</p>

      <div className="mt-7 flex items-center justify-between gap-1">
        <div className="flex flex-1 flex-col">
          <p className="text-[16px] font-medium text-[#F5F5F2]">
            <span className="text-[#C3073F]">@</span> {name}
          </p>
          <p className="text-secondary mt-1 text-[12px]">
            {designation} of {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-16 sm:py-28">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C3073F]">Testimonial</p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-8"><h2 className="text-4xl font-bold tracking-[-0.05em] text-[#F5F5F2] sm:text-6xl">Trusted to make ideas tangible.</h2>
      <div className="flex flex-wrap gap-7 pt-4 max-sm:justify-center">
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
      </div>
    </section>
  );
};

export default Feedbacks;
