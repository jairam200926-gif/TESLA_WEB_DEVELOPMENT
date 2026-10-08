import { BrowserRouter, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";

import {
  About,
  Contact,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
import { useEffect, useState } from "react";
import { config } from "./constants/config";
import AdminPage from "./admin/AdminPage";
import ServicesMarquee from "./components/layout/ServicesMarquee";
import Services from "./components/sections/Services";
import Stats from "./components/sections/Stats";
import Footer from "./components/layout/Footer";
import ProjectInquiry from "./components/sections/ProjectInquiry";

const App = () => {
  const [projectInquiryOpen, setProjectInquiryOpen] = useState(false);
  const [showProjectLauncher, setShowProjectLauncher] = useState(false);

  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  useEffect(() => {
    const updateLauncher = () => setShowProjectLauncher(window.scrollY > window.innerHeight * 0.72);
    window.addEventListener("scroll", updateLauncher, { passive: true });
    updateLauncher();
    return () => window.removeEventListener("scroll", updateLauncher);
  }, []);

  useEffect(() => {
    const openInquiry = () => setProjectInquiryOpen(true);
    window.addEventListener("open-project-inquiry", openInquiry);
    return () => window.removeEventListener("open-project-inquiry", openInquiry);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={
          <div className="bg-primary relative z-0">
            <Navbar />
            <Hero />
            <ServicesMarquee />
            <About />
            <Tech />
            <Services />
            <Stats />
            <Works />
            <div className="relative z-0">
              <Contact />
              <StarsCanvas />
            </div>
            <Footer />
            <motion.button
              type="button"
              onClick={() => setProjectInquiryOpen(true)}
              tabIndex={showProjectLauncher ? 0 : -1}
              aria-hidden={!showProjectLauncher}
              initial={false}
              animate={{ opacity: showProjectLauncher ? 1 : 0, y: showProjectLauncher ? 0 : 56, scale: showProjectLauncher ? 1 : 0.94 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`fixed bottom-5 right-5 z-[9998] rounded-full border border-white/20 bg-[#C3073F] px-5 py-3 text-xs font-bold text-white shadow-[0_12px_32px_rgba(195,7,63,.4)] transition hover:-translate-y-1 hover:bg-[#950740] sm:bottom-7 sm:right-7 sm:px-6 sm:text-sm ${showProjectLauncher ? "pointer-events-auto" : "pointer-events-none"}`}
            >
              Start a project ↗
            </motion.button>
            <ProjectInquiry open={projectInquiryOpen} onClose={() => setProjectInquiryOpen(false)} />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
