import { motion } from 'framer-motion';
import ResumeUpload from './ResumeUpload';
import DreamRoleInput from './DreamRoleInput';
import ProfileLinks from './ProfileLinks';

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
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="pixel-hero mt-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pixel-hero-content"
      >
        <motion.h1
          variants={itemVariants}
          className="pixel-title mb-8"
        >
          Your AI Career Navigator
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-12 max-w-2xl text-center mx-auto leading-relaxed"
        >
          Discover your true potential. Our AI-powered platform designed with simplicity and ease of use in mind. Get in-depth feedback provided by experts to create an intuitive experience!
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mb-16"
        >
          <button className="btn-pixel">
            Get Started
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl space-y-8"
        >
          <motion.div variants={itemVariants}>
            <DreamRoleInput
              onRoleAnalyzed={onDreamRoleAnalyzed}
              disabled={dreamRoleAnalyzed}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ResumeUpload onUploadComplete={handleUploadComplete} disabled={uploadComplete} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ProfileLinks
              githubUrl={githubUrl}
              linkedInUrl={linkedInUrl}
              onGitHubChange={onGitHubChange}
              onLinkedInChange={onLinkedInChange}
              onValidationChange={onValidationChange}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
