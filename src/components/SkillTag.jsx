import { motion } from 'framer-motion';

export default function SkillTag({ skill, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="pixel-tag inline-flex items-center px-4 py-2 text-sm
        cursor-default transition-transform"
    >
      {skill}
    </motion.span>
  );
}
