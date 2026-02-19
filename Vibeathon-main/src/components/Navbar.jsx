import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="rounded-2xl px-5 py-3.5 max-w-5xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_2px_20px_-4px_rgba(99,102,241,0.08)]">
        <a
          href="#"
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
            <Compass className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-[1.05rem] font-medium tracking-tight text-gray-800 group-hover:text-indigo-600 transition-colors duration-200"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Career Navigator
          </span>
        </a>

        <div className="flex items-center gap-1">
          <a
            href="#skills"
            className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50/80 transition-all duration-200"
          >
            Skills
          </a>
          <a
            href="#roadmap"
            className="px-3.5 py-2 text-[13px] font-medium text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50/80 transition-all duration-200"
          >
            Roadmap
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
