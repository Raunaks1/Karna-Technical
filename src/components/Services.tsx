"use client";

import { useState, useEffect } from "react";
import { Users, Flame, Shield, FileCheck, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      title: "Engineering & Manpower Services",
      icon: <Users className="text-white" size={32} />,
      color: "bg-blue-600",
      borderColor: "border-blue-600",
      desc: "KARNA TECHNICAL provides comprehensive Engineering, Manpower Supply, Recruitment, and Hiring Services to meet the workforce requirements of various industries and organizations.",
      lists: [
        {
          title: "Manpower Services",
          items: [
            "Office Staff",
            "Engineers",
            "Managers & Supervisors & Executives",
            "Safety Officers, Managers, Engineers & Supervisors",
            "Civil, Mechanical & Electrical Engineers and Manpower",
            "Skilled, Semi-Skilled & Unskilled Manpower",
          ],
        },
        {
          title: "Recruitment & Hiring Services",
          items: [
            "Recruitment of technical and non-technical professionals",
            "Manpower sourcing and placement",
            "Candidate screening and selection",
            "Hiring of skilled and experienced workforce",
            "Contract-based & Project-based manpower supply",
            "Customized manpower solutions according to client requirements",
          ],
        },
      ],
    },
    {
      title: "Fire Equipment Sales & Services",
      icon: <Flame className="text-white" size={32} />,
      color: "bg-red-500",
      borderColor: "border-red-500",
      desc: "KARNA TECHNICAL provides supply, installation, inspection, servicing, and maintenance of fire-fighting and safety equipment.",
      lists: [
        {
          title: "Fire & Safety Equipment",
          items: [
            "Fire Extinguishers",
            "Fire Hydrant Systems",
            "Fire Hose Pipes",
            "Sand Buckets",
            "Safety Shoes & Helmets",
            "Safety Reflective Jackets & Cones",
            "Full Body Harnesses",
            "Other Fire-Fighting & Safety Equipment",
          ],
        },
        {
          title: "Services",
          items: [
            "Supply of fire-fighting equipment",
            "Installation of fire-fighting equipment",
            "Inspection and testing",
            "Servicing and maintenance",
            "Periodic safety equipment inspection",
          ],
        },
      ],
    },
    {
      title: "Fire & Safety Training",
      icon: <Shield className="text-white" size={32} />,
      color: "bg-primary",
      borderColor: "border-primary",
      desc: "KARNA TECHNICAL provides practical and customized training programs designed to improve workplace safety awareness, emergency preparedness, and employee response capabilities.",
      lists: [
        {
          title: "Training Programs",
          items: [
            "Fire Safety Training",
            "Workplace Safety Training",
            "Emergency Response Training",
            "Emergency Evacuation Training",
            "Customized Fire & Safety Training Programs",
          ],
        },
        {
          title: "Customization",
          items: [
            "Programs tailored to the workplace environment",
            "Adapted to specific operational requirements",
            "Designed to match specific safety needs of each client",
          ],
        },
      ],
    },
    {
      title: "Safety Audit & Compliance",
      icon: <FileCheck className="text-white" size={32} />,
      color: "bg-green-600",
      borderColor: "border-green-600",
      desc: "KARNA TECHNICAL assists organizations in identifying workplace hazards, improving safety practices, and maintaining applicable safety requirements.",
      lists: [
        {
          title: "Our Services Include",
          items: [
            "Safety Audits",
            "Workplace Risk Assessments",
            "Fire & Safety Compliance Inspections",
            "Safety Compliance Reviews",
            "Audit and Compliance Reports",
            "Corrective Action Recommendations",
          ],
        },
        {
          title: "Our Approach",
          items: [
            "Identifying potential risks in the workplace",
            "Evaluating existing safety practices",
            "Recommending practical corrective actions",
            "Supporting safer and more compliant workplaces",
          ],
        },
      ],
    },
  ];

  const nextSlide = () => setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="services" className="relative z-20 -mt-16 lg:-mt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden relative min-h-[580px] md:min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`bg-white dark:bg-gray-900 shadow-xl dark:shadow-gray-950 flex flex-col h-full border-t-4 ${services[currentIndex].borderColor} absolute inset-0 w-full transition-colors duration-300`}
              >
                <div className="p-8 md:p-12 flex-grow flex flex-col h-full">
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`w-16 h-16 shrink-0 ${services[currentIndex].color} flex items-center justify-center rounded-sm shadow-md`}>
                      {services[currentIndex].icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1">
                        {currentIndex + 1} / {services.length}
                      </p>
                      <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                        {services[currentIndex].title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium text-base leading-relaxed">
                    {services[currentIndex].desc}
                  </p>

                  <div className="flex-grow space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                    {services[currentIndex].lists.map((list, listIdx) => (
                      <div key={listIdx}>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide text-xs border-b border-gray-100 dark:border-gray-700 pb-2">
                          {list.title}
                        </h4>
                        <ul className="space-y-2">
                          {list.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-3">
                              <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={16} />
                              <span className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 px-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "bg-primary w-6" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-3"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
