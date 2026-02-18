import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-16 px-4 mt-8 border-t border-gray-100 bg-white/50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-800" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Career Navigator
            </span>
          </div>
          <p className="text-gray-600 text-sm flex items-center gap-1.5">
            Built with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for your growth
          </p>
        </div>
        <p className="text-gray-500 text-xs mt-6 text-center sm:text-left">
          © 2024 AI-Powered Career Platform
        </p>
      </div>
    </motion.footer>
  );
}
