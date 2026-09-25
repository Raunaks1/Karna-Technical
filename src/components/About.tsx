import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const commitmentPoints = [
  "Quality service",
  "Timely support",
  "Skilled resources",
  "Professional expertise",
  "Customized solutions",
  "Commitment to workplace safety",
  "Reliable and responsive service",
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      <div
        className="absolute left-0 top-0 w-64 h-full opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#888 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-5/12">
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
              Company Profile
            </span>
            <h2 className="text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 dark:text-white leading-[1.2] mb-6">
              About <span className="text-primary">Us</span>
            </h2>

            <div className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed space-y-4">
              <p>
                <strong className="text-gray-900 dark:text-white">
               KARNA TECHNICAL ENGINEERING SERVICES</strong> is a professionally managed organization providing comprehensive Engineering, Manpower, Fire & Safety, Training, Equipment, Audit, and Compliance Services to industries, businesses, and organizations.
              </p>
              <p>
                Our objective is to provide reliable, skilled, and efficient workforce solutions while helping clients maintain safe, compliant, and productive workplaces. We offer customized services designed to meet the specific operational, workforce, safety, and project requirements of our clients.
              </p>
              <p>
                With a strong focus on quality, safety, professionalism, and timely service, we aim to build long-term relationships with our clients across diverse industries.
              </p>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Commitment</h3>
                <p className="mb-4">
                  We are committed to delivering reliable, professional, and customized Engineering, Manpower, Fire & Safety, Training, Equipment, Audit, and Compliance Services. Through skilled manpower, professional expertise, quality service, and a strong focus on workplace safety, we aim to support our clients in achieving safe, efficient, compliant, and productive workplaces.
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">We believe in building long-term professional relationships through:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {commitmentPoints.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="text-primary shrink-0" size={16} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#services"
                className="bg-primary hover:bg-red-700 text-white px-8 py-3 text-sm font-bold tracking-wider transition-colors rounded-sm uppercase"
              >
                Our Services
              </a>
              <a
                href="#branches"
                className="border-2 border-gray-200 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-300 text-gray-900 dark:text-white px-8 py-3 text-sm font-bold tracking-wider transition-colors rounded-sm uppercase bg-white dark:bg-transparent"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="w-full lg:w-7/12 relative min-h-[500px]">
            <div className="absolute top-0 right-0 w-[70%] h-[350px] z-10 shadow-lg">
              <Image src="/images/about_handshake_1789924243006.jpg" alt="Partnership Handshake" fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-[60%] h-[350px] z-20 shadow-2xl border-8 border-white dark:border-gray-800">
              <Image src="/images/about_technician_1789924227342.jpg" alt="Fire Safety Technician" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
