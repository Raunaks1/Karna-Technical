import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white rounded-full p-1">
                <Logo className="w-12 h-12" />
              </div>
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
                <a href="tel:+918905214092" className="text-sm hover:text-white transition-colors">
                  +91 8905214092 (Ms. Swati Sen)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary shrink-0" size={20} />
                <a href="mailto:karnatech86ktfss@gmail.com" className="text-sm hover:text-white transition-colors">
                  karnatech86ktfss@gmail.com
                </a>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 text-sm font-bold tracking-wider transition-colors rounded-sm uppercase">
              Contact Us
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#about" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#services" className="text-sm hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="#partners" className="text-sm hover:text-primary transition-colors">Channel Partners</Link></li>
              <li><Link href="#branches" className="text-sm hover:text-primary transition-colors">Our Branches</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Services</h3>
            <ul className="flex flex-col gap-3">
              <li className="text-sm hover:text-white transition-colors cursor-pointer">Equipment Servicing</li>
              <li className="text-sm hover:text-white transition-colors cursor-pointer">Safety Training</li>
              <li className="text-sm hover:text-white transition-colors cursor-pointer">Manpower Supply</li>
              <li className="text-sm hover:text-white transition-colors cursor-pointer">Safety Audits</li>
              <li className="text-sm hover:text-white transition-colors cursor-pointer">Equipment Installation</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Karna Technical Fire & Safety Services. All Rights Reserved.</p>
          <p>An ISO 9001:2015 Certified Company</p>
        </div>
      </div>
    </footer>
  );
}
