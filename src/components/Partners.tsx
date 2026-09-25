export default function Partners() {
  const partners = [
    "Carbonic Industries",
    "Karam",
    "Venus",
    "Intime Fire",
    "Varuney MFG Industries",
    "Safe Fire",
  ];

  return (
    <section id="partners" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="lg:w-1/3 text-center lg:text-left">
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
              Channel Partners
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-gray-900 dark:text-white leading-tight">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
              We collaborate with top-tier manufacturers to deliver the highest quality fire safety equipment.
            </p>
          </div>

          <div className="lg:w-2/3">
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-12 gap-y-10">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 flex items-center justify-center"
                >
                  <span className="font-heading font-bold text-xl text-gray-800 dark:text-gray-200 tracking-tight">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
