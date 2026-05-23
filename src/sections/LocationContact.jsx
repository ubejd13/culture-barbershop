import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, Instagram, Facebook, Phone, Mail } from "lucide-react";

export default function LocationContact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="section-dark py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
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
            Our Location and Hours
          </h2>
          <p className="text-white/50 text-base lg:text-lg">
            Visit us at our conveniently located shop in the heart of the city.
          </p>
        </motion.div>

        {/* Location + Hours row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          {/* Location Card */}
          <div className="service-card rounded-2xl p-10 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <MapPin size={32} strokeWidth={1.5} className="text-white" />
            </div>
            <h3 className="text-white font-semibold text-base">Location</h3>
            <p className="text-white/55 text-sm leading-relaxed">
              153 Eduard Lir, Prishtinë 10000
              <br />
              Prishtinë, Kosove
            </p>
          </div>

          {/* Hours Card */}
          <div className="service-card rounded-2xl p-10 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <Clock size={32} strokeWidth={1.5} className="text-white" />
            </div>
            <h3 className="text-white font-semibold text-base">Hours</h3>
            <div className="flex gap-10 text-sm">
              <div className="text-center">
                <div className="text-white/60 mb-1">Monday – Saturday</div>
                <div className="text-white font-medium">9 AM – 9 PM</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 mb-1">Sunday</div>
                <div className="text-white font-medium">10 AM – 7 PM</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="service-card rounded-2xl p-12 flex flex-col items-center text-center gap-6"
        >
          <div>
            <h3
              className="text-white font-bold text-xl mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Us
            </h3>
            <p className="text-white/45 text-sm">
              Get in touch with us for more information.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            {[
              {
                icon: <Instagram size={18} strokeWidth={1.5} />,
                text: "@culturebarbershop.pr",
                href: "https://www.instagram.com/culturebarbershop.pr?fbclid=IwY2xjawR-ZnxleHRuA2FlbQIxMABicmlkETFNbnZxb2dVR1MzMnJyZ2lSc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHtLzx25VPsjNC58-41RGzh-3A88TSpzZyDfcM6tCsgsAPKvwNFFHyTKygRQW_aem_TgXRcVGOZ1xM_7tVIiMp5Q",
              },
              {
                icon: <Facebook size={18} strokeWidth={1.5} />,
                text: "Culture Barbershop",
                href: "https://www.facebook.com/profile.php?id=61582219491214&locale=mk_MK",
              },
              {
                icon: <Phone size={18} strokeWidth={1.5} />,
                text: "+383 44 384 499+",
                href: "tel:+38344384499",
              },
            ].map(({ icon, text, href }) => (
              <motion.a
                key={text}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
              >
                <span className="text-white/60">{icon}</span>
                <span>{text}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
