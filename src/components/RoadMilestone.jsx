import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoadMilestone({ milestone, index, isCompleted, onToggle, isLast, alignLeft }) {
  const handleToggle = (e) => {
    e?.stopPropagation?.();
    onToggle?.();
    if (!isCompleted) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22d3ee', '#6366f1', '#a78bfa'],
        gravity: 0.8,
        scalar: 1,
      });
    }
  };

  const dayNum = index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: alignLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`flex items-center gap-6 ${alignLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Card */}
      <div className={`flex-1 ${alignLeft ? 'pr-8' : 'pl-8'}`}>
        <motion.article
          onClick={handleToggle}
          whileHover={!isCompleted ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
          className={`group relative rounded-xl p-5 cursor-pointer transition-all ${
            isCompleted
              ? 'bg-white/10 border border-white/20'
              : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold text-white text-[15px] leading-snug ${isCompleted ? 'line-through opacity-70' : ''}`}>
                {milestone.title}
              </h4>
              <p className={`text-sm mt-1.5 leading-relaxed ${isCompleted ? 'text-slate-400' : 'text-slate-300'}`}>
                {milestone.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300">
                  <Clock className="w-3.5 h-3.5" />
                  {milestone.days} {milestone.days === 1 ? 'day' : 'days'}
                </span>
                {isCompleted && (
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Done
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      {/* Pin on the road */}
      <div className="relative z-10 shrink-0">
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/40'
              : 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/40 hover:border-white'
          }`}
        >
          <AnimatePresence mode="wait">
            {isLast ? (
              <Star className="w-6 h-6 text-white" fill="white" />
            ) : isCompleted ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span key="num" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white font-bold text-sm">
                {dayNum}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Spacer for symmetry */}
      <div className="flex-1" />
    </motion.div>
  );
}
