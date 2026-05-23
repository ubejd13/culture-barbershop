import { motion } from "framer-motion";

import img1 from "../assets/img1.jpg";
export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-black flex items-center overflow-hidden"
    >
      {/* Background noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[calc(100vh-4rem)]">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-none lg:rounded-2xl">
              <img
                src={img1}
                alt="Culture Barbershop Interior"
                className="w-full h-[55vh] lg:h-[80vh] object-cover"
                style={{ filter: "brightness(0.92) contrast(1.05)" }}
              />
              {/* Subtle green tint overlay matching the original */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right — Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
            className="flex flex-col justify-center px-0 lg:px-16 py-12 lg:py-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-[2.8rem] lg:text-[3.8rem] xl:text-[4.2rem] font-bold leading-[1.1] tracking-tight text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Experience the Art of Barbering
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-white/65 text-[1.05rem] leading-relaxed mb-10 max-w-md"
            >
              Our skilled barbers provide the perfect cut, shave, and grooming
              experience in a classic, refined setting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex gap-4 flex-col sm:flex-row"
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 12px 32px rgba(255,255,255,0.12)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo("appointments")}
                className="btn-primary w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold"
              >
                Book Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo("services")}
                className="w-full sm:w-auto px-10 py-4 rounded-xl text-base font-semibold
                           border border-white/20 text-white/80 hover:border-white/50 hover:text-white
                           transition-all duration-300"
              >
                Our Services
              </motion.button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="flex gap-10 mt-14 pt-10 border-t border-white/10"
            >
              {[
                { num: "4+", label: "Expert Barbers" },
                { num: "500+", label: "Happy Clients" },
                { num: "5★", label: "Rated Service" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.num}
                  </div>
                  <div className="text-white/45 text-xs mt-1 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
