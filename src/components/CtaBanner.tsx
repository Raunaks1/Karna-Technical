export default function CtaBanner() {
  return (
    <section className="bg-primary py-12 lg:py-16">
      <div className="container mx-auto px-4 md:px-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-white mb-2">
              Get more information, request a quote today!
            </h2>
            <p className="text-red-100 text-sm font-medium tracking-widest">
              Safety · Quality · Skilled Manpower · Professional Service · Compliance
            </p>
          </div>
          <a
            href="tel:8905214092"
            className="bg-white hover:bg-gray-100 text-primary px-8 py-4 text-sm font-bold tracking-wider transition-colors rounded-sm uppercase whitespace-nowrap shadow-lg"
          >
            Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
