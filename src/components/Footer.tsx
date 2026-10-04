import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import LogoBadge from "./LogoBadge";

const FOOTER_SERVICES: { label: string; href: string; description: string }[] = [
  {
    label: "Manpower Supply",
    href: "/#services",
    description: "Skilled, semi-skilled and technical manpower on contract or project basis",
  },
  {
    label: "Recruitment & Hiring",
    href: "/#services",
    description: "Screening, selection and placement of technical and non-technical professionals",
  },
  {
    label: "Fire Equipment Supply",
    href: "/#services",
    description: "Fire extinguishers, hydrant systems, hose pipes, sand buckets and more",
  },
  {
    label: "Equipment Installation",
    href: "/#services",
    description: "Professional installation of fire-fighting and safety equipment",
  },
  {
    label: "Equipment Servicing",
    href: "/#services",
    description: "Inspection, testing, servicing and maintenance of fire-fighting equipment",
  },
  {
    label: "Safety Gear & PPE",
    href: "/#services",
    description: "Helmets, safety shoes, reflective jackets, full body harnesses and cones",
  },
  {
    label: "Fire & Safety Training",
    href: "/#services",
    description: "Fire safety, emergency response and evacuation training programs",
  },
  {
    label: "Safety Audits",
    href: "/#services",
    description: "Workplace safety audits and detailed compliance reports",
  },
  {
    label: "Risk Assessment & Compliance",
    href: "/#services",
    description: "Hazard identification, compliance inspections and corrective action recommendations",
  },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <LogoBadge wrapperClassName="w-16 h-16 md:w-[72px] md:h-[72px]" />
              <h2 className="text-2xl font-heading font-bold text-white leading-tight max-w-[200px]">
                Karna Technical Fire & Safety Services
              </h2>
            </div>
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 shrink-0" size={20} />
                <p className="text-sm leading-relaxed max-w-md">
                  Plot No. 35, Shri Laxmi Narayan Nivas, Kashi Green Society,
                  Pipariya, PO Khamaria, OFC. Ward No. 79, Jabalpur, Madhya Pradesh – 482005
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={20} />
                <a href="tel:+918169437734" className="text-sm hover:text-white transition-colors">
                  +91 8169437734 (Ms. Swati Sen)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary shrink-0" size={20} />
                <a href="mailto:karnatech@karnaengservice.com" className="text-sm hover:text-white transition-colors">
                  karnatech@karnaengservice.com
                </a>
              </div>
            </div>
            <a
              href="mailto:karnatech@karnaengservice.com"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 text-sm font-bold tracking-wider transition-colors rounded-sm uppercase"
            >
              Contact Us
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/#about" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#services" className="text-sm hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="/#partners" className="text-sm hover:text-primary transition-colors">Channel Partners</Link></li>
               <li><Link href="/#branches" className="text-sm hover:text-primary transition-colors">Our Branches</Link></li>
               <li><Link href="/login" className="text-sm hover:text-primary transition-colors">Owner/HR Login</Link></li>
               <li><Link href="/privacy-policy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Services</h3>
            <nav aria-label="Services">
              <ul className="flex flex-col gap-3">
                {FOOTER_SERVICES.map((service) => (
                  <li key={service.label}>
                    <Link
                      href={service.href}
                      title={service.description}
                      className="text-sm hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:text-white rounded-sm max-md:min-h-[44px] max-md:inline-flex max-md:items-center"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Karna Technical Fire & Safety Services. All Rights Reserved.</p>
          <p>An ISO 9001:2026 Certified Company</p>
        </div>
      </div>
    </footer>
  );
}
