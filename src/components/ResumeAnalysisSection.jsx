import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, Star, Lightbulb, Target, User, Briefcase, Award } from 'lucide-react';

function Section({ title, icon: Icon, color = 'purple', children, delay = 0 }) {
  const colors = {
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    red: 'text-red-500 bg-red-50 border-red-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="pixel-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-gray-700 text-sm">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Tag({ label, variant = 'purple' }) {
  const styles = {
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {label}
    </span>
  );
}

export default function ResumeAnalysisSection({ skills, dreamRole }) {
  if (!skills) return null;

  const allCurrentSkills = [
    ...(skills.skills || []),
    ...(skills.languages || []),
    ...(skills.tools || []),
    ...(skills.frameworks || []),
  ];

  // Calculate missing skills if dream role is available
  const requiredSkills = dreamRole ? [
    ...(dreamRole.technicalSkills || []),
    ...(dreamRole.frameworks || []),
    ...(dreamRole.languages || []),
    ...(dreamRole.tools || []),
  ] : [];

  const currentLower = allCurrentSkills.map(s => s.toLowerCase());
  const missingSkills = requiredSkills.filter(s => !currentLower.some(c => c.includes(s.toLowerCase()) || s.toLowerCase().includes(c)));
  const matchedSkills = requiredSkills.filter(s => currentLower.some(c => c.includes(s.toLowerCase()) || s.toLowerCase().includes(c)));
  const matchPct = requiredSkills.length > 0 ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : null;

  const analysis = skills.analysis;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 px-4"
      id="analysis"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="pixel-section-title mb-2">Resume Analysis</h2>
          <p className="text-gray-400 text-sm">Here's what we found in your resume</p>
        </motion.div>

        {/* Match score if dream role set */}
        {matchPct !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="pixel-card text-center py-8"
          >
            <p className="text-sm text-gray-500 mb-2">Match with <span className="font-semibold text-purple-600">{dreamRole?.role}</span></p>
            <div className="text-5xl font-bold text-purple-600 mb-3">{matchPct}%</div>
            <div className="w-full max-w-xs mx-auto h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${matchPct}%` }}
                className={`h-full rounded-full transition-all duration-1000 ${matchPct >= 70 ? 'bg-green-500' : matchPct >= 40 ? 'bg-amber-500' : 'bg-red-400'}`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {matchPct >= 70 ? '🎉 Great match! You\'re well-qualified.' : matchPct >= 40 ? '📈 Good foundation — some gaps to bridge.' : '🚀 Lots of room to grow — the roadmap will help!'}
            </p>
          </motion.div>
        )}

        {/* Professional Summary */}
        {analysis?.professionalSummary && (
          <Section title="Professional Summary" icon={User} color="blue" delay={0.1}>
            <p className="text-sm text-gray-600 leading-relaxed">{analysis.professionalSummary}</p>
            {analysis.experienceLevel && (
              <div className="mt-3">
                <Tag label={`${analysis.experienceLevel} Level`} variant="purple" />
              </div>
            )}
          </Section>
        )}

        {/* Current Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.languages?.length > 0 && (
            <Section title="Languages" icon={CheckCircle} color="green" delay={0.15}>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map(s => <Tag key={s} label={s} variant="green" />)}
              </div>
            </Section>
          )}
          {skills.frameworks?.length > 0 && (
            <Section title="Frameworks" icon={Briefcase} color="purple" delay={0.2}>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map(s => <Tag key={s} label={s} variant="purple" />)}
              </div>
            </Section>
          )}
          {skills.tools?.length > 0 && (
            <Section title="Tools" icon={Target} color="blue" delay={0.25}>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map(s => <Tag key={s} label={s} variant="gray" />)}
              </div>
            </Section>
          )}
          {skills.skills?.length > 0 && (
            <Section title="Soft Skills" icon={Star} color="amber" delay={0.3}>
              <div className="flex flex-wrap gap-2">
                {skills.skills.map(s => <Tag key={s} label={s} variant="amber" />)}
              </div>
            </Section>
          )}
          {skills.extracurricular?.length > 0 && (
            <Section title="Extracurricular / Certifications" icon={Award} color="purple" delay={0.35}>
              <div className="flex flex-wrap gap-2">
                {skills.extracurricular.map(s => <Tag key={s} label={s} variant="purple" />)}
              </div>
            </Section>
          )}
        </div>

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <Section title={`Skills to Develop for ${dreamRole?.role || 'Your Dream Role'}`} icon={XCircle} color="red" delay={0.4}>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map(s => <Tag key={s} label={s} variant="red" />)}
            </div>
            <p className="text-xs text-gray-400 mt-3">These are the key skills you'll need to land this role. Your 30-day roadmap below will help you bridge these gaps.</p>
          </Section>
        )}

        {/* Key Strengths */}
        {analysis?.keyStrengths?.length > 0 && (
          <Section title="Key Strengths" icon={Star} color="amber" delay={0.45}>
            <ul className="space-y-2">
              {analysis.keyStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-amber-500 mt-0.5">✦</span>
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Areas for Improvement */}
        {analysis?.areasForImprovement?.length > 0 && (
          <Section title="Areas for Improvement" icon={TrendingUp} color="purple" delay={0.5}>
            <ul className="space-y-2">
              {analysis.areasForImprovement.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-purple-400 mt-0.5">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Recommendations */}
        {analysis?.recommendations?.length > 0 && (
          <Section title="Recommendations" icon={Lightbulb} color="blue" delay={0.55}>
            <ul className="space-y-2">
              {analysis.recommendations.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-400 font-bold mt-0.5">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Industry Fit */}
        {analysis?.industryFit?.length > 0 && (
          <Section title="Best Industry Fit" icon={Briefcase} color="green" delay={0.6}>
            <div className="flex flex-wrap gap-2">
              {analysis.industryFit.map(s => <Tag key={s} label={s} variant="green" />)}
            </div>
          </Section>
        )}
      </div>
    </motion.section>
  );
}
