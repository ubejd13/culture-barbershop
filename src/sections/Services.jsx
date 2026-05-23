import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Scissors, Waves, Brush, Wind } from "lucide-react";

// Custom icons to match the original design closely
const ShaveIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="18"
      cy="18"
      r="13"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="18"
      cy="18"
      r="7"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M18 5 L18 11 M18 25 L18 31 M5 18 L11 18 M25 18 L31 18"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const GroomingIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 28 L18 10 L26 28"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 22 L23 22"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CurlIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 13 Q14 8 20 13 Q26 18 20 23"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M10 20 Q16 15 22 20 Q28 25 22 30"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const services = [
  {
    icon: <Scissors size={34} strokeWidth={1.5} />,
    title: "Haircuts",
    desc: "Our skilled barbers provide the perfect cut for any style.",
  },
  {
    icon: <ShaveIcon />,
    title: "Shaves",
    desc: "Experience a classic straight-edge shave with hot towels.",
  },
  {
    icon: <GroomingIcon />,
    title: "Grooming",
    desc: "Complete your look with our beard trims and styling services.",
  },
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="service-card rounded-2xl p-8 flex flex-col items-center text-center gap-5 cursor-pointer group"
    >
      <div className="h-12 flex items-center justify-center text-white/90 group-hover:text-white transition-colors">
        {service.icon}
      </div>
      <div>
        <h3 className="text-white font-semibold text-base mb-2 tracking-wide">
          {service.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="section-dark py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2
            className="text-[2.5rem] lg:text-[3.2rem] font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Services
          </h2>
          <p className="text-white/50 text-base lg:text-lg max-w-xl mx-auto">
            From classic cuts to modern styles, our barbers are experts in the
            art of grooming.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
