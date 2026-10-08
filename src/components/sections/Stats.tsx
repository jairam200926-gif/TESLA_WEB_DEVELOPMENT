import { motion } from "framer-motion";
import { SectionWrapper } from "../../hoc";

const stats = [["03+", "Years learning & building"], ["10+", "Tools and technologies"], ["02", "Featured product builds"]];

const Stats = () => (
  <div className="premium-card grid rounded-3xl p-7 sm:grid-cols-3 sm:p-10">
    {stats.map(([value, label], index) => <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`py-5 sm:px-8 ${index ? "sm:border-l sm:border-white/10" : ""}`}>
      <p className="text-5xl font-bold tracking-[-0.06em] text-[#C3073F]">{value}</p>
      <p className="mt-2 text-sm text-[#C8C8C8]">{label}</p>
    </motion.div>)}
  </div>
);

export default SectionWrapper(Stats, "stats");
