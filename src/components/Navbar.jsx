import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center cursor-pointer"
            onClick={() => scrollTo("hero")}
          >
            <div className="flex flex-col leading-none">
              <span
                className="text-[1.5rem] font-bold tracking-widest"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "white",
                  letterSpacing: "0.15em",
                }}
              >
                CULTURE
              </span>
              <span className="text-[0.5rem] tracking-[0.35em] text-white/50 mt-[-2px]">
                BARBERSHOP
              </span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button className="nav-link" onClick={() => scrollTo("hero")}>
              Home
            </button>
            <button
              className="nav-link"
              onClick={() => scrollTo("appointments")}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
