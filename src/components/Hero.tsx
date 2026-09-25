import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full pt-20 md:pt-24 bg-gray-50 overflow-hidden">
      <div className="relative w-full" style={{ minHeight: "85vh" }}>
        <Image
          src="/images/hero_landscape_team_1789927120091.jpg"
          alt="Karna Technical Fire & Safety Services team"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative z-10 flex items-center h-full" style={{ minHeight: "85vh" }}>
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-xl">
              <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">
                Safety First · Belonging Since 2020
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold text-white leading-[1.1] mb-4">
                Karna Technical<br />
                <span className="text-primary">Fire & Safety</span><br />
                Services
              </h1>
              <p className="text-gray-200 text-base md:text-lg max-w-md mb-4 leading-relaxed">
                A professionally managed organization providing comprehensive Engineering, Manpower, Fire & Safety, Training, Equipment, Audit, and Compliance Services.
              </p>
              <p className="text-yellow-400 font-semibold text-sm mb-10 tracking-wide">
                ISO 9001:2015 Certified Company
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <a
                  href="#services"
                  className="bg-primary hover:bg-red-700 text-white px-8 py-3 text-sm font-bold tracking-wider uppercase transition-colors rounded-sm"
                >
                  Our Services
                </a>
                <a
                  href="#branches"
                  className="bg-white/10 hover:bg-white/20 border border-white/50 text-white px-8 py-3 text-sm font-bold tracking-wider uppercase transition-colors rounded-sm backdrop-blur-sm"
                >
                  Contact Us
                </a>
              </div>
              <a
                href="#services"
                className="inline-flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-widest"
              >
                <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center animate-bounce">
                  <ChevronDown size={16} />
                </div>
                Scroll
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
