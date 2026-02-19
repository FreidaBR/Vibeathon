import { motion } from 'framer-motion';

export default function SkillTag({ skill, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ scale: 1.04 }}
      className="pixel-tag cursor-default"
    >
      {skill}
    </motion.span>
  );
}
