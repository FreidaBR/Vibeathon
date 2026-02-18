import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import RoadMilestone from './RoadMilestone';
import { Loader2, AlertCircle, Trophy } from 'lucide-react';

export default function RoadmapSection({ milestones = [], loading, error }) {
  const [completedMilestones, setCompletedMilestones] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (!milestones?.length) return;
    try {
      const roadmapKey = milestones.map((m) => m.title).join('|');
      const savedKey = localStorage.getItem('roadmapKey');
      const saved = localStorage.getItem('roadmapCompletion');
      if (savedKey === roadmapKey && saved) {
        setCompletedMilestones(JSON.parse(saved));
      } else {
        localStorage.setItem('roadmapKey', roadmapKey);
        setCompletedMilestones({});
      }
    } catch (err) {
      console.error('Error loading roadmap completion:', err);
    }
  }, [milestones]);

  useEffect(() => {
    if (milestones?.length) {
      const completed = Object.values(completedMilestones).filter(Boolean).length;
      setCompletionPercentage(Math.round((completed / milestones.length) * 100));
    }
  }, [completedMilestones, milestones]);

  const toggleMilestone = (index) => {
    const updated = { ...completedMilestones, [index]: !completedMilestones[index] };
    setCompletedMilestones(updated);
    try {
      localStorage.setItem('roadmapCompletion', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving roadmap completion:', err);
    }
  };

  const hasContent = milestones?.length > 0;
  const showSection = hasContent || loading || error;

  if (!showSection) return null;

  return (
    <section className="py-24 px-4 scroll-mt-24" id="roadmap">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Roadmap for Launch
          </h2>
          <p className="text-slate-500 text-sm font-medium">30 Day Programme</p>
        </div>

        {hasContent && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
              />
            </div>
            <span className="text-sm font-bold text-slate-700 tabular-nums">{completionPercentage}%</span>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-5">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="font-medium text-gray-800">Building your roadmap...</p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-gray-800 font-medium text-center">{error}</p>
          </motion.div>
        )}

        {hasContent && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 p-8 md:p-12 shadow-2xl"
          >
            {/* Winding road - central path */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 pointer-events-none">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.6) 0%, rgba(99, 102, 241, 0.6) 100%)',
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full border-t-2 border-b-2 border-dashed border-white/40"
                style={{ borderLeft: 'none', borderRight: 'none' }}
              />
            </div>

            <div className="relative space-y-6">
              {milestones.map((milestone, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <RoadMilestone
                    key={index}
                    milestone={milestone}
                    index={index}
                    isCompleted={completedMilestones[index]}
                    onToggle={() => toggleMilestone(index)}
                    isLast={index === milestones.length - 1}
                    alignLeft={isLeft}
                  />
                );
              })}
            </div>
          </motion.div>
        )}

        {hasContent && !loading && completionPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-xl">
              <Trophy className="w-10 h-10" />
              <div>
                <h3 className="text-xl font-bold">LAUNCH!</h3>
                <p className="text-white/90 text-sm">You completed your 30-day roadmap.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
