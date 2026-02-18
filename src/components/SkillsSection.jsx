import { motion } from 'framer-motion';
import SkillTag from './SkillTag';
import { Code, Languages, Wrench, Layers, Award } from 'lucide-react';

const CATEGORIES = [
  { key: 'skills', label: 'Skills', icon: Award },
  { key: 'languages', label: 'Languages', icon: Languages },
  { key: 'tools', label: 'Tools', icon: Wrench },
  { key: 'frameworks', label: 'Frameworks', icon: Layers },
  { key: 'extracurricular', label: 'Extracurricular', icon: Code },
];

export default function SkillsSection({ skills }) {
  if (!skills) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="py-24 px-4 scroll-mt-24"
      id="skills"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-4"
          >
            Extracted from your resume
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pixel-section-title"
          >
            Skills Analysis
          </motion.h2>
          <p className="text-gray-600 max-w-md mx-auto">AI-identified skills to highlight in your career journey</p>
        </div>

        <div className="space-y-6">
          {CATEGORIES.map(({ key, label, icon: Icon }, catIndex) => {
            const items = skills[key];
            if (!items?.length) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.06 }}
                className="pixel-card"
              >
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{label}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
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
