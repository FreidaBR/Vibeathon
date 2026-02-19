import { motion } from 'framer-motion';
import SkillTag from './SkillTag';

const CATEGORIES = [
  { key: 'skills', label: 'Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'tools', label: 'Tools' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'extracurricular', label: 'Extracurricular' },
];

export default function SkillsSection({ skills }) {
  if (!skills) return null;

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
