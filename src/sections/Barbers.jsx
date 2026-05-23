import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import myImage from "../assets/img2.png";
import { subscribeToBarbers } from "../lib/barbers";

function BarberCard({ barber, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="barber-card rounded-2xl p-8 flex flex-col items-center text-center group cursor-pointer"
    >
      <div className="relative mb-5">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/15
                      group-hover:border-white/30 transition-all duration-400"
        >
          <img
            src={barber.img}
            alt={barber.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {/* Subtle teal tint ring matching original design */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ boxShadow: "0 0 0 2px rgba(61, 122, 90, 0.4)" }}
        />
      </div>
      <h3
        className="text-white font-bold text-lg mb-1"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {barber.name}
      </h3>
      <span className="text-white/45 text-sm">{barber.role}</span>
    </motion.div>
  );
}

export default function Barbers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToBarbers(
      (nextBarbers) => {
        setBarbers(nextBarbers);
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, []);

  return (
    <section id="barbers" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Green background panels matching original */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${myImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Decorative panel lines */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Border decorations suggesting paneled wall */}
      <div className="absolute top-8 left-8 right-8 bottom-8 border border-white/5 rounded-none pointer-events-none" />
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/3 rounded-none pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2
            className="text-[2.5rem] lg:text-[3.2rem] font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Meet Our Barbers
          </h2>
          <p className="text-white/55 text-base lg:text-lg max-w-xl mx-auto">
            Our team of experienced barbers are dedicated to providing the best
            grooming experience.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <p className="col-span-full py-10 text-center text-white/45">
              Loading barbers...
            </p>
          ) : barbers.length ? (
            barbers.map((barber, i) => (
              <BarberCard
                key={barber.id || barber.name}
                barber={barber}
                index={i}
              />
            ))
          ) : (
            <p className="col-span-full py-10 text-center text-white/45">
              No barbers available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
