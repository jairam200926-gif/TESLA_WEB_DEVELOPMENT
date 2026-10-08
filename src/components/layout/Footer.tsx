const Footer = () => (
  <footer className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/10 px-6 py-10 text-sm text-[#8D8D8D] sm:flex-row sm:items-center sm:justify-between sm:px-16">
    <p>© {new Date().getFullYear()} TWD — Crafted with clarity.</p>
    <a href="#home" className="font-semibold text-[#C3073F] transition-colors hover:text-[#950740]">Back to top ↑</a>
  </footer>
);

export default Footer;
