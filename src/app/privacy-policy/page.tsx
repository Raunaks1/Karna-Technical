import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Karna Technical Fire & Safety Services",
  description:
    "How Karna Technical Fire & Safety Services collects, uses, protects and shares personal data, including employee records handled through our secure Owner/HR dashboard.",
};

const LAST_UPDATED = "30 September 2026";

const COMPANY = {
  name: "Karna Technical Fire & Safety Services",
  address:
    "Plot No. 35, Shri Laxmi Narayan Nivas, Kashi Green Society, Pipariya, PO Khamaria, OFC. Ward No. 79, Jabalpur, Madhya Pradesh – 482005, India",
  phone: "+91 8169437734",
  email: "karnatech@karnaengservice.com",
};

type Section = {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

const sections: Section[] = [
  {
    id: "about",
    heading: "1. About This Policy",
    paragraphs: [
      `This Privacy Policy explains how ${COMPANY.name} ("Karna Technical", "we", "us" or "our") collects, uses, stores, protects and shares personal data when you visit this website, contact us, or when your personal data is processed as part of our human resources operations.`,
      "We are committed to handling personal data lawfully, fairly and transparently, in line with the Digital Personal Data Protection Act, 2023 (the \"DPDP Act\") of India and any other applicable law.",
    ],
  },
  {
    id: "scope",
    heading: "2. Scope of This Policy",
    paragraphs: [
      "This Policy applies to all visitors of this website and to the authorised Owner/HR users of our internal dashboard. It covers personal data we process directly as well as personal data processed on our behalf through our technology service providers.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "3. Information We Collect",
    paragraphs: ["We collect the following categories of personal data:"],
    bullets: [
      "Information you provide to us — such as your name, organisation, designation, email address, telephone number, and the contents of enquiries or messages you send us by email or telephone.",
      "Employee and personnel records — held in our secure dashboard, including employee code, full name, email address, telephone number, designation, department, assigned location, date of joining, and employment status.",
      "Account and authentication data — the email address and password credentials used by our Owner/HR users to access the dashboard, together with authentication session cookies.",
      "Technical data — such as IP address, browser and device type, pages visited, and the approximate time of your visit, collected through server logs for security and troubleshooting.",
    ],
  },
  {
    id: "how-we-use",
    heading: "4. How We Use Your Information",
    paragraphs: ["We use personal data only for the following purposes:"],
    bullets: [
      "Responding to enquiries, quotations, and service requests.",
      "Managing our workforce, including maintaining accurate employee and deployment records, and administering training, safety, and compliance programmes.",
      "Operating the secure Owner/HR dashboard, authenticating users, and maintaining an audit trail of changes made within it.",
      "Maintaining the security, availability, and integrity of our website and systems.",
      "Meeting legal, tax, and statutory record-keeping obligations.",
      "Improving our website, services, and internal processes.",
    ],
  },
  {
    id: "legal-basis",
    heading: "5. Legal Basis for Processing",
    paragraphs: [
      "Under the DPDP Act, we process personal data on one or more of the following bases:",
    ],
    bullets: [
      "Consent given by you, which you may withdraw at any time.",
      "Performance of a contract, or steps taken prior to entering into a contract, with you or with the organisation you represent.",
      "Compliance with a legal obligation, including labour, safety, tax, and record-keeping laws applicable to us.",
      "Legitimate uses permitted under the DPDP Act, such as responding to business enquiries and protecting our systems and premises.",
      "Your employment or engagement with us, where you are a member of our workforce.",
    ],
  },
  {
    id: "cookies",
    heading: "6. Cookies and Local Storage",
    paragraphs: [
      "This website uses cookies and browser local storage only as strictly necessary for the website to operate. We do not use advertising cookies or cross-site tracking cookies.",
    ],
    bullets: [
      "Essential authentication cookies — set by our authentication provider to keep Owner/HR users signed in and to prevent unauthorised access to the dashboard. These cannot be disabled without breaking the dashboard.",
      "Theme preference — your light or dark mode choice is stored in your browser's local storage on your own device. It is never transmitted to us.",
      "Server logs — recorded for security and diagnostic purposes, as described in Section 3.",
    ],
  },
  {
    id: "sharing",
    heading: "7. How We Share Information",
    paragraphs: [
      "We do not sell, rent, or trade personal data. We share personal data only in the following circumstances:",
    ],
    bullets: [
      "With service providers who process data on our instructions, including our cloud hosting and database provider, email delivery providers, and IT support vendors. Such providers are required to maintain confidentiality and appropriate security.",
      "With our employees, contractors, and professional advisers where necessary to perform their duties.",
      "With our clients and deployment partners where required to deliver agreed manpower, engineering, training, fire and safety, or compliance services, and only to the extent necessary for that purpose.",
      "Where required by law, court order, or a competent government or regulatory authority. We will respond only to lawful requests and will notify you unless prohibited from doing so.",
      "In connection with a merger, acquisition, or sale of assets, in which case we will provide notice before your personal data becomes subject to a different privacy policy.",
    ],
  },
  {
    id: "security",
    heading: "8. Data Security",
    paragraphs: [
      "We have implemented reasonable technical and organisational measures designed to protect personal data from unauthorised access, alteration, disclosure, or loss. These measures include:",
    ],
    bullets: [
      "Row Level Security and role-based access controls applied to every database table holding personal data.",
      "Access to the dashboard restricted to authorised Owner/HR users, protected by authentication and server-side route protection.",
      "Audit logging of dashboard activity so that additions, edits, and deletions of employee records are recorded and attributable.",
      "Encryption of data in transit and reliance on managed security infrastructure for data at rest.",
      "Internal operating procedures and staff confidentiality obligations aligned with our ISO 9001 certified quality management system.",
    ],
  },
  {
    id: "retention",
    heading: "9. Data Retention",
    paragraphs: [
      "We retain personal data only for as long as it is necessary for the purposes described in this Policy, or as required by applicable law.",
    ],
    bullets: [
      "Enquiry and contact records — retained for up to 3 years from the last interaction, unless a longer period is required to support an active commercial relationship.",
      "Employee and personnel records — retained for the duration of employment and for up to 8 years thereafter, in order to satisfy statutory, tax, labour, and dispute record-keeping obligations.",
      "Audit logs — retained for up to 3 years.",
      "Server and security logs — retained for up to 12 months.",
    ],
  },
  {
    id: "your-rights",
    heading: "10. Your Rights",
    paragraphs: [
      "Subject to applicable law, you have the right to request from us:",
    ],
    bullets: [
      "Confirmation of whether we process your personal data, and access to a copy of that data.",
      "Correction of inaccurate or incomplete personal data.",
      "Erasure of personal data, where its processing is no longer necessary or lawful.",
      "Withdrawal of consent, where processing is based on consent.",
      "Nomination of a person who may exercise your rights on your behalf if you are unable to do so.",
      "Reassignment or erasure of certain personal data, where the relevant exceptions under the DPDP Act apply.",
    ],
  },
  {
    id: "grievance",
    heading: "11. Grievance Officer",
    paragraphs: [
      "In accordance with the DPDP Act, we have designated a Grievance Officer who is responsible for ensuring the timely resolution of complaints relating to the processing of personal data.",
    ],
  },
  {
    id: "children",
    heading: "12. Children's Information",
    paragraphs: [
      "This website and our services are not directed at children under 18 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us personal data, please contact us and we will delete it.",
    ],
  },
  {
    id: "changes",
    heading: "13. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal obligations. The \"Last Updated\" date at the top of this page indicates when the Policy was last revised. We will post the revised Policy on this page and, where the change is significant, notify affected users.",
    ],
  },
  {
    id: "governing-law",
    heading: "14. Governing Law",
    paragraphs: [
      "This Privacy Policy is governed by and construed in accordance with the laws of India. Subject to the provisions of the DPDP Act, the courts at Jabalpur, Madhya Pradesh shall have exclusive jurisdiction over any disputes arising out of or in connection with this Policy.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const grievanceOfficer = {
    name: "Ms. Swati Sen",
    designation: "Marketing Executive",
    phone: COMPANY.phone,
    email: COMPANY.email,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Page header */}
        <section className="relative overflow-hidden bg-secondary dark:bg-gray-900 py-16 lg:py-20">
          <div
            className="absolute left-0 top-0 w-64 h-full opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#888 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="container mx-auto px-4 md:px-8 relative">
            <span className="text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
              Legal
            </span>
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-white leading-[1.2]">
              Privacy Policy
            </h1>
            <p className="mt-4 text-gray-300 max-w-2xl leading-relaxed">
              How {COMPANY.name} collects, uses, protects, and shares personal
              data.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Last Updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="py-14 lg:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {/* Table of contents */}
              <aside className="lg:col-span-3">
                <div className="lg:sticky lg:top-28 rounded-2xl border border-gray-200 dark:border-white/10 bg-background dark:bg-[#11151d] p-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">
                    On this page
                  </h2>
                  <ol className="space-y-2 text-sm">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="block text-gray-600 dark:text-gray-400 transition-colors hover:text-primary"
                        >
                          {section.heading}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="#contact"
                        className="block text-gray-600 dark:text-gray-400 transition-colors hover:text-primary"
                      >
                        15. Contact Us
                      </a>
                    </li>
                  </ol>
                </div>
              </aside>

              {/* Policy content */}
              <article className="lg:col-span-9 space-y-10">
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-background dark:bg-[#11151d] p-5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                    This Policy explains how we handle personal data. If you have
                    any questions about it, or wish to exercise any of your
                    rights, contact us using the details in Section 15.
                  </p>
                </div>

                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2 className="text-xl lg:text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                      {section.heading}
                    </h2>
                    <div className="space-y-4 text-sm leading-7 text-gray-600 dark:text-gray-400">
                      {section.paragraphs?.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                      {section.bullets && (
                        <ul className="space-y-2 pl-1">
                          {section.bullets.map((bullet, index) => (
                            <li key={index} className="flex gap-3">
                              <span
                                aria-hidden="true"
                                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.id === "grievance" && (
                        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-background dark:bg-[#11151d] p-5">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {grievanceOfficer.name}
                          </p>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {grievanceOfficer.designation}, {COMPANY.name}
                          </p>
                          <p className="mt-3 flex items-center gap-2">
                            <Phone size={14} className="text-primary shrink-0" />
                            <a
                              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                              className="text-primary hover:underline"
                            >
                              {grievanceOfficer.phone}
                            </a>
                          </p>
                          <p className="mt-1 flex items-center gap-2">
                            <Mail size={14} className="text-primary shrink-0" />
                            <a
                              href={`mailto:${grievanceOfficer.email}`}
                              className="text-primary hover:underline break-all"
                            >
                              {grievanceOfficer.email}
                            </a>
                          </p>
                          <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                            We will acknowledge your complaint within 72 hours
                            and resolve it within the period prescribed by the
                            DPDP Act.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                ))}

                {/* Contact */}
                <section id="contact" className="scroll-mt-28">
                  <h2 className="text-xl lg:text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                    15. Contact Us
                  </h2>
                  <p className="text-sm leading-7 text-gray-600 dark:text-gray-400 mb-5">
                    If you have questions about this Privacy Policy, wish to
                    exercise your rights, or have a grievance, please write to us
                    at the address below. We will respond as soon as reasonably
                    practicable.
                  </p>
                  <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-background dark:bg-[#11151d] p-6 space-y-4">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {COMPANY.name}
                    </p>
                    <p className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                      <span className="leading-6">{COMPANY.address}</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={16} className="text-primary shrink-0" />
                      <a
                        href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                        className="hover:text-primary transition-colors"
                      >
                        {COMPANY.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Mail size={16} className="text-primary shrink-0" />
                      <a
                        href={`mailto:${COMPANY.email}`}
                        className="hover:text-primary transition-colors break-all"
                      >
                        {COMPANY.email}
                      </a>
                    </p>
                  </div>
                </section>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href="/"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    ← Back to Karna Technical Fire &amp; Safety Services
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}