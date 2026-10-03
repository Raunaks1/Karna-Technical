"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Check } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookie_consent");
    if (!hasConsented) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    // In a real app, you might want to handle essential vs non-essential cookies
    localStorage.setItem("cookie_consent", "false");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-md z-50"
        >
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-xl text-orange-600 dark:text-orange-500">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <h3 className="font-outfit font-semibold text-lg text-zinc-900 dark:text-white">
                    We value your privacy
                  </h3>
                </div>
                <button 
                  onClick={handleDecline}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-inter">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/privacy-policy" className="text-orange-600 dark:text-orange-400 hover:underline font-medium">Privacy Policy</Link> for more information.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  onClick={handleDecline}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Decline Non-Essential
                </button>
                <button
                  onClick={handleAccept}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Accept All
                    <Check className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                  </span>
                  
                  {/* Hover effect background */}
                  <div className={`absolute inset-0 bg-white/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
