import { MapPin, Phone, Mail, Building2 } from "lucide-react";

export default function Branches() {
  const branches: {
    city: string;
    region: string;
    state: string;
    address?: string;
    contactPerson?: string;
    phone?: string;
    phoneHref?: string;
    highlight?: string;
  }[] = [
    {
      city: "Pithampur (Indore)",
      region: "Dhar",
      state: "Madhya Pradesh",
      phone: "+91 8169437734",
      phoneHref: "tel:+918169437734",
    },
    {
      city: "Jamnagar",
      region: "",
      state: "Gujarat",
      highlight: "Manufacturing Unit — Joint Venture with Varia Fire",
      phone: "+91 8169437734",
      phoneHref: "tel:+918169437734",
    },
    {
      city: "Gohparu",
      region: "Shahdol",
      state: "Madhya Pradesh",
      address: "Karua Road, Gohparu, District Shahdol, Madhya Pradesh – 484770",
      contactPerson: "Mr. Ambuj Sen",
      phone: "+91 8169437734",
      phoneHref: "tel:+918169437734",
    },
    {
      city: "Ramnagar",
      region: "Maihar",
      state: "Madhya Pradesh",
      address: "Bamhanadi Village Road, Opp. Om Palace, Ramnagar, Madhya Pradesh – 485881",
      contactPerson: "Mr. Chandrabhan Sen",
      phone: "+91 8169437734",
      phoneHref: "tel:+918169437734",
    },
    {
      city: "Bhopal",
      region: "",
      state: "Madhya Pradesh",
      phone: "+91 8169437734",
      phoneHref: "tel:+918169437734",
    },
  ];

  return (
    <section id="branches" className="py-20 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 scroll-mt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
            Our Network
          </span>
          <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-gray-900 dark:text-white">
            Branches Across India
          </h2>
        </div>

        {/* Corporate Office */}
        <div className="p-8 bg-white dark:bg-gray-900 border-2 border-primary shadow-md mb-12">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex items-start gap-4 flex-1">
              <Building2 className="text-primary shrink-0 mt-1" size={28} />
              <div>
                <span className="inline-block mb-2 text-xs font-bold px-2 py-1 uppercase tracking-wider bg-red-50 dark:bg-red-950 text-primary">
                  Corporate Office
                </span>
                <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-1">Jabalpur</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Madhya Pradesh</p>
              </div>
            </div>
            <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Full Address:</p>
              <p>
                Plot No. 35, Shri Laxmi Narayan Nivas,<br />
                Kashi Green Society, Pipariya, PO Khamaria,<br />
                OFC. Ward No. 79, Jabalpur,<br />
                Madhya Pradesh – 482005
              </p>
            </div>
            <div className="flex-1 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="text-primary shrink-0" size={18} />
                <a href="tel:+918169437734" className="hover:text-primary transition-colors font-medium">
                  +91 8169437734
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="text-primary shrink-0" size={18} />
                <a
                  href="mailto:karnatech@karnaengservice.com"
                  className="hover:text-primary transition-colors font-medium break-all"
                >
                  karnatech@karnaengservice.com
                </a>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
                Contact: Ms. Swati Sen — Marketing Executive
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400 dark:text-gray-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-1">{branch.city}</h3>
                  {branch.highlight && (
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug mb-1">{branch.highlight}</p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{branch.state}</p>
                  {branch.region && (
                    <span className="inline-block mt-3 text-xs font-bold px-2 py-1 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {branch.region}
                    </span>
                  )}
                  {branch.address && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{branch.address}</p>
                  )}
                  {branch.contactPerson && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Contact: <span className="font-semibold text-gray-800 dark:text-gray-200">{branch.contactPerson}</span>
                    </p>
                  )}
                  {branch.phone && branch.phoneHref && (
                    <a
                      href={branch.phoneHref}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                      <Phone size={14} className="text-primary shrink-0" />
                      {branch.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
