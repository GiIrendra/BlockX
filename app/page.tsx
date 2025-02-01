"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarquePage from "./components/Robo/Marque";
import { TypingAnimation } from "@/components/ui/typing-animation";
import Dashboard from "./components/Dashboard";
import DeFiPoolMetrics from "./components/Robo/DeFiPoolMetrics";
import FinalPredict from "./components/Robo/FinalPredict";
import TokenPricePrediction from "./components/Robo/TokenPricePrediction";
import TokenMetrics from "./components/Robo/TokenMetrics";
import { FaSun, FaMoon } from "react-icons/fa"; // Icons for light/dark mode
import RotationalFigure from "./components/fox/fox";
import { SparklesText } from "@/components/ui/sparkles-text";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Introduction");
  const [isDarkMode, setIsDarkMode] = useState(true); // State for dark/light mode

  const introRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  // const stakingRef = useRef<HTMLDivElement>(null);
  const defiPoolMetricsRef = useRef<HTMLDivElement>(null);
  const tokenPricePredictionRef = useRef<HTMLDivElement>(null);
  const tokenMetricsRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => [
      { ref: introRef, name: "Introduction" },
      { ref: dashboardRef, name: "Dashboard" },
      // { ref: stakingRef, name: "Staking" },
      { ref: defiPoolMetricsRef, name: "DeFi Pool Metrics" },
      { ref: tokenPricePredictionRef, name: "Token Price Predictions" },
      { ref: tokenMetricsRef, name: "Token Metrics" },
    ],
    []
  );

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark/light mode styles to the body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Intersection Observer to highlight active section in the navbar
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = sectionRefs.find((sec) => sec.ref.current === entry.target);
          if (section) {
            setActiveSection(section.name);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    });

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sectionRefs.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  // Function to handle smooth scrolling to sections
  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // Close the mobile menu after clicking a link
  };

  // Variants for navbar menu items
  const menuItemVariants = {
    rest: { scale: 1, color: "#ffffff", textShadow: "none" },
    hover: {
      scale: 1.1,
      color: "#06b6d4",
      textShadow: "0px 0px 15px rgba(255, 255, 255, 0.8)",
      transition: { type: "spring", stiffness: 300 },
    },
    active: {
      scale: 1.2,
      color: "#06b6d4",
      textShadow: "0px 0px 15px rgba(255, 255, 255, 0.8)",
    },
  };

  // Variants for mobile dropdown menu
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  // Variants for section animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className={`font-sans scroll-smooth ${isDarkMode ? "dark" : ""}`}>
      {/* Navbar */}
      <nav className="fixed top-0 font-serif w-full bg-black text-white shadow-md z-50">
        <div className="flex justify-between items-center px-4 py-4">
          <SparklesText text="BlockX" className="text-4xl" sparklesCount={4} />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full focus:outline-none"
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-400 text-2xl" />
            ) : (
              <FaMoon className="text-gray-300 text-2xl" />
            )}
          </button>

          {/* Hamburger Menu */}
          <button
            className="block md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 h-0.5 bg-white mb-1 transition-transform duration-300"></div>
            <div className="w-6 h-0.5 bg-white mb-1 transition-transform duration-300"></div>
            <div className="w-6 h-0.5 bg-white transition-transform duration-300"></div>
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {sectionRefs.map(({ name }, index) => (
              <motion.li
                key={index}
                onClick={() => handleScroll(sectionRefs[index].ref)}
                className="cursor-pointer"
                variants={menuItemVariants}
                initial="rest"
                whileHover="hover"
                animate={activeSection === name ? "active" : "rest"}
              >
                {name}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-gray-700"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropdownVariants}
            >
              <ul className="flex flex-col items-center space-y-4 py-4">
                {sectionRefs.map(({ name }, index) => (
                  <motion.li
                    key={index}
                    onClick={() => handleScroll(sectionRefs[index].ref)}
                    className="cursor-pointer"
                    variants={menuItemVariants}
                    initial="rest"
                    whileHover="hover"
                    animate={activeSection === name ? "active" : "rest"}
                  >
                    {name}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Sections */}
      <RotationalFigure />
      <motion.div
        ref={introRef}
        className="min-h-screen h-auto bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-6 md:px-16"
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
 <TypingAnimation
  lines={[
    "Explore the future of Web3 investments",
    "by managing NFTs and DeFi in one place.",
  ]}
  duration={100}
  eraseSpeed={50}
  pauseBetweenLines={1000}
  delay={500} // Initial delay of 500ms
  className="mt-[55vh] text-4xl"
/>

        <MarquePage />
      </motion.div>

      {/* Dashboard Section */}
      <motion.div
        ref={dashboardRef}
        className="min-h-screen bg-gray-300 dark:bg-gray-800 px-6 md:px-16"
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <Dashboard isDarkMode={isDarkMode} />
      </motion.div>

      {/* Staking Section */}
      {/* <motion.div
        ref={stakingRef}
        className="min-h-screen bg-gray-300 dark:bg-gray-800 flex flex-col items-center justify-center px-6 md:px-16"
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <h2 className="text-xl md:text-3xl font-semibold text-green-900 dark:text-green-100 mb-4 text-center">
          Staking
        </h2>
        <p className="text-sm md:text-lg text-green-800 dark:text-green-200 text-center max-w-2xl">
          Stake your NFTs to earn rewards and maximize your investments.
        </p>
      </motion.div> */}

      {/* DeFi Pool Metrics Section */}
      <motion.div
        ref={defiPoolMetricsRef}
        className="min-h-screen mt-8 bg-gray-300 dark:bg-gray-700 flex flex-col items-center justify-center px-6 md:px-16"
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <DeFiPoolMetrics isDarkMode={isDarkMode} />
      </motion.div>

      {/* Token Price Predictions Section */}
      <motion.div
        ref={tokenPricePredictionRef}
        className="min-h-screen mt-8 bg-gray-300 dark:bg-gray-600 flex flex-col items-center justify-center px-6 md:px-16"
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <TokenPricePrediction isDarkMode={isDarkMode} />
        <FinalPredict isDarkMode={isDarkMode}/>
      </motion.div>

      {/* Token Metrics Section */}
      <motion.div
        ref={tokenMetricsRef}
        className="min-h-screen mt-8 mb-9 bg-gray-300 dark:bg-gray-500 flex flex-col items-center justify-center px-6 md:px-16"
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <TokenMetrics isDarkMode={isDarkMode} />
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-4 text-center">
        <p className="text-xs md:text-sm">&copy; 2025 NFT & DeFi Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;