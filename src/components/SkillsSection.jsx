import { motion } from 'framer-motion';
import SkillTag from './SkillTag';
import { Target, BarChart3 } from 'lucide-react';

const CATEGORIES = [
  { key: 'skills', label: 'Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'tools', label: 'Tools' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'extracurricular', label: 'Extracurricular' },
];

function getRoleFit(skills, dreamRole) {
  if (!dreamRole) return null;
  const allCurrent = [
    ...(skills.skills || []),
    ...(skills.languages || []),
    ...(skills.tools || []),
    ...(skills.frameworks || []),
  ].map((s) => s.toLowerCase());
  const required = [
    ...(dreamRole.technicalSkills || []),
    ...(dreamRole.frameworks || []),
    ...(dreamRole.languages || []),
    ...(dreamRole.tools || []),
  ].filter(Boolean);
  if (required.length === 0) return null;
  const matched = required.filter((r) =>
    allCurrent.some((c) => c.includes(r.toLowerCase()) || r.toLowerCase().includes(c))
  );
  return {
    matchPct: Math.round((matched.length / required.length) * 100),
    matched: matched.length,
    required: required.length,
    role: dreamRole.role,
  };
}

export default function SkillsSection({ skills, dreamRole }) {
  if (!skills) return null;

  const roleFit = getRoleFit(skills, dreamRole);
  const categoryCounts = CATEGORIES.map(({ key, label }) => ({
    key,
    label,
    count: (skills[key] || []).length,
  })).filter((c) => c.count > 0);
  const maxCount = Math.max(1, ...categoryCounts.map((c) => c.count));

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-20 px-4 scroll-mt-20"
      id="skills"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pixel-section-title mb-12"
        >
          Skills Analysis
        </motion.h2>

        <div className="space-y-8">
          {/* Role fit card */}
          {roleFit !== null && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pixel-card"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-purple-400">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border text-purple-600 bg-purple-50 border-purple-200">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="pixel-label mb-0">Fit for role</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                How well your skills match <span className="font-semibold text-purple-600">{roleFit.role}</span>
              </p>
              <div className="flex items-end gap-4 flex-wrap">
                <div className="text-4xl font-bold text-purple-600 tabular-nums">{roleFit.matchPct}%</div>
                <div className="flex-1 min-w-[140px] max-w-xs">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-purple-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${roleFit.matchPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${
                        roleFit.matchPct >= 70
                          ? 'bg-green-500'
                          : roleFit.matchPct >= 40
                            ? 'bg-amber-500'
                            : 'bg-red-400'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {roleFit.matched} of {roleFit.required} required skills matched
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {roleFit.matchPct >= 70
                  ? 'Great match — you\'re well-qualified for this role.'
                  : roleFit.matchPct >= 40
                    ? 'Good foundation — the 30-day roadmap will help bridge gaps.'
                    : 'Lots of room to grow — follow the roadmap to build key skills.'}
              </p>
            </motion.div>
          )}

          {/* Skills distribution graph */}
          {categoryCounts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="pixel-card"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-purple-400">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border text-purple-600 bg-purple-50 border-purple-200">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="pixel-label mb-0">Your skills at a glance</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Skill count by category</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {categoryCounts.map(({ key, label, count }, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50/80 border border-purple-200 min-w-[140px]"
                  >
                    <span className="pixel-label text-xs">{label}</span>
                    <span className="text-xl font-bold text-purple-600 tabular-nums">{count}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden border border-purple-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(count / maxCount) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Category cards */}
          {CATEGORIES.map(({ key, label }, catIndex) => {
            const items = skills[key];
            if (!items?.length) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="pixel-card"
              >
                <h3 className="pixel-label mb-4 pb-3 border-b-2 border-purple-400">
                  {label}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill, i) => (
                    <SkillTag key={skill} skill={skill} index={i} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
