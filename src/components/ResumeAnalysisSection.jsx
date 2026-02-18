import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ChevronDown,
  Award,
  Target,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Star,
  Shield,
} from 'lucide-react';

const LEVEL_COLORS = {
  Junior: 'from-amber-500 to-orange-600',
  Mid: 'from-indigo-500 to-violet-600',
  Senior: 'from-emerald-500 to-teal-600',
  Lead: 'from-rose-500 to-pink-600',
};

export default function ResumeAnalysisSection({ analysis }) {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysis) return null;

  const { experienceLevel, professionalSummary, keyStrengths, areasForImprovement, recommendations, industryFit } = analysis;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'strengths', label: 'Strengths', icon: Star },
    { id: 'improve', label: 'Improve', icon: Target },
    { id: 'recommendations', label: 'Next Steps', icon: Lightbulb },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-20 px-4 scroll-mt-24"
      id="resume-analysis"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white"
        >
          <div
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between px-6 py-5 cursor-pointer bg-gradient-to-r from-indigo-50 via-violet-50/50 to-pink-50/30 border-b border-gray-100 hover:from-indigo-100/50 hover:via-violet-100/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  AI Resume Analysis
                </h2>
                <p className="text-sm text-gray-600">Detailed insights from your resume</p>
              </div>
            </div>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-indigo-500">
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pt-6 pb-4">
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience Level</span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${LEVEL_COLORS[experienceLevel] || 'from-indigo-500 to-violet-600'}`}>
                      {experienceLevel}
                    </span>
                  </div>
                </div>

                <div className="flex border-b border-gray-100 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6 space-y-6 bg-white">
                  {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div>
                        <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">Professional Summary</h3>
                        <p className="text-gray-700 leading-relaxed">{professionalSummary}</p>
                      </div>
                      {industryFit?.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Industry Fit
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {industryFit.map((industry, i) => (
                              <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'strengths' && (
                    <motion.div key="strengths" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Key Strengths
                      </h3>
                      <ul className="space-y-4">
                        {keyStrengths?.map((strength, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <Star className="w-4 h-4 text-emerald-600" fill="currentColor" />
                            </span>
                            <span className="text-gray-700 pt-1">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'improve' && (
                    <motion.div key="improve" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-4">
                        {areasForImprovement?.map((area, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <Target className="w-4 h-4 text-amber-600" />
                            </span>
                            <span className="text-gray-700 pt-1">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'recommendations' && (
                    <motion.div key="recommendations" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Actionable Recommendations
                      </h3>
                      <ul className="space-y-4">
                        {recommendations?.map((rec, i) => (
                          <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                            <span className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                              {i + 1}
                            </span>
                            <span className="text-gray-700 pt-1.5">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}
