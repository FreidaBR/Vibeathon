import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoadMilestone({ milestone, index, isCompleted, onToggle }) {
  const handleToggle = () => {
    onToggle?.();
    if (!isCompleted) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c5dfa', '#a78bfa', '#c4b5fd', '#ffffff', '#34D399'],
        gravity: 0.8,
        scalar: 1.2,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <motion.div
        onClick={handleToggle}
        whileHover={!isCompleted ? { y: -2 } : {}}
        className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-300 flex items-start gap-4
          ${isCompleted
            ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200 shadow-sm'
            : 'bg-white/70 backdrop-blur-sm border-purple-100 hover:border-purple-300 hover:shadow-md shadow-sm'
          }`}
      >
        {/* Step number / check button */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); handleToggle(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300
            ${isCompleted
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md shadow-green-200'
              : 'bg-purple-50 border-2 border-purple-200 text-purple-600 hover:border-purple-400'
            }`}
        >
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.span key="num" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {index + 1}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h4 className={`font-semibold text-sm leading-snug transition-all duration-300 ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
            }`}>
              {milestone.title}
            </h4>
            <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
              ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
              <Clock className="w-3 h-3" />
              {milestone.days} {milestone.days === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className={`text-xs leading-relaxed transition-all duration-300 ${
            isCompleted ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {milestone.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
