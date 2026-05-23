export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-black border-t border-white/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div
              className="mb-4 cursor-pointer"
              onClick={() => scrollTo("hero")}
            >
              <span
                className="text-2xl font-bold tracking-widest"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "white",
                  letterSpacing: "0.15em",
                }}
              >
                CULTURE
              </span>
              <div className="text-[0.45rem] tracking-[0.35em] text-white/35 mt-[-2px]">
                BARBERSHOP
              </div>
            </div>
          </div>

          {/* Quick Links */}

          {/* Hours */}
          <div>
            <h4 className="text-white/70 text-xs tracking-widest uppercase mb-5">
              Opening Hours
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-8">
                <span className="text-white/45">Mon – Sat</span>
                <span className="text-white/75">9 AM – 9 PM</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-white/45">Sunday</span>
                <span className="text-white/75">10 AM – 7 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between gap-3 items-center">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Culture Barbershop. All rights
            reserved.
          </p>
          <p className="text-white/20 text-xs">
            153 Eduard Lir, Prishtinë 10000
          </p>
        </div>
      </div>
    </footer>
  );
}
