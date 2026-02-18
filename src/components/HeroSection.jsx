import { motion } from 'framer-motion';
import ResumeUpload from './ResumeUpload';
import DreamRoleInput from './DreamRoleInput';
import ProfileLinks from './ProfileLinks';
import { ArrowDown } from 'lucide-react';

export default function HeroSection({
  onResumeUploaded,
  githubUrl,
  linkedInUrl,
  onGitHubChange,
  onLinkedInChange,
  onValidationChange,
  uploadComplete,
  onDreamRoleAnalyzed,
  dreamRoleAnalyzed,
}) {
  const handleUploadComplete = (skills) => {
    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    onResumeUploaded?.(skills);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="pixel-hero mt-14">
      {/* Aurora glow from right - decorative only */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="aurora-glow absolute -right-32 top-1/2 w-[400px] h-[400px] -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
          }}
        />
        <div
          className="aurora-glow-secondary absolute -right-20 top-1/3 w-[300px] h-[300px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pixel-hero-content"
      >
        {/* Headline block - compact */}
        <div className="mb-8">
          <motion.h1 variants={itemVariants} className="pixel-title mb-3">
            Your AI Career Navigator
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base text-gray-600 max-w-lg mx-auto leading-relaxed"
          >
            Personalized insights, skill analysis & a 30-day roadmap — tailored to your goals.
          </motion.p>
        </div>

        {/* Inputs - compact grid: Dream Role + Resume side by side on large, Profile below */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl mx-auto space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <DreamRoleInput
              onRoleAnalyzed={onDreamRoleAnalyzed}
              disabled={dreamRoleAnalyzed}
            />
            <ResumeUpload
              onUploadComplete={handleUploadComplete}
              disabled={uploadComplete}
            />
          </div>
          <ProfileLinks
            githubUrl={githubUrl}
            linkedInUrl={linkedInUrl}
            onGitHubChange={onGitHubChange}
            onLinkedInChange={onLinkedInChange}
            onValidationChange={onValidationChange}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-center"
        >
          <a
            href="#skills"
            className="inline-flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-500 transition-colors group"
          >
            <span className="text-[11px] font-medium uppercase tracking-wider">Scroll</span>
            <ArrowDown className="w-4 h-4 animate-bounce group-hover:text-indigo-500" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
