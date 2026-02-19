import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function MotivationSign({ quote }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex justify-center my-6"
    >
      <div className="pixel-card inline-flex items-center gap-3 px-6 py-4">
        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <p className="text-sm font-medium text-gray-700 text-center">
          {quote}
        </p>
      </div>
    </motion.div>
  );
}
