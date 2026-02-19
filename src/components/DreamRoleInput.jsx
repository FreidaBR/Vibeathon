import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { analyzeDreamRole } from '../lib/api';

export default function DreamRoleInput({ onRoleAnalyzed, disabled }) {
  const [roleInput, setRoleInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  async function handleRoleSubmit(e) {
    e.preventDefault();
    const role = roleInput.trim();
    if (!role) return;

    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeDreamRole(role);
      setAnalyzed(true);
      onRoleAnalyzed?.(result);
      setTimeout(() => {
        setRoleInput('');
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to analyze dream role');
      setIsAnalyzing(false);
    }
  }

  if (analyzed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="pixel-card text-center border-green-300 bg-green-50/60">
          <p className="text-green-600 font-semibold text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Dream role analyzed successfully
          </p>
          <p className="text-gray-500 mt-1 text-xs">Ready to upload your resume</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-xl mx-auto"
    >
      <form onSubmit={handleRoleSubmit}>
        <div className="relative group" style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            placeholder="What's your dream role?"
            disabled={disabled || isAnalyzing}
            className="input-pixel"
            style={{ paddingRight: '3rem' }}
          />
          {isAnalyzing && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-2 ml-1 font-medium"
          >
            {error}
          </motion.p>
        )}
        <p className="text-xs text-gray-400 mt-2 ml-1">
          We'll identify required skills and gaps for your target role
        </p>
      </form>
    </motion.div>
  );
}
