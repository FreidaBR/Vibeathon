import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, CheckCircle2 } from 'lucide-react';
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
      setTimeout(() => setRoleInput(''), 500);
    } catch (err) {
      setError(err.message || 'Failed to analyze dream role');
      setIsAnalyzing(false);
    }
  }

  if (analyzed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="pixel-card"
      >
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">Dream role analyzed</p>
            <p className="text-xs text-gray-500">Ready for resume</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleRoleSubmit}
      className="w-full"
    >
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        1. Dream Role
      </label>
      <div className="relative group">
        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 z-10 group-focus-within:text-indigo-600 transition-colors" />
        <input
          type="text"
          value={roleInput}
          onChange={(e) => setRoleInput(e.target.value)}
          placeholder="E.g. Full Stack Developer, Product Manager"
          disabled={disabled || isAnalyzing}
          className="input-pixel pl-11 pr-24 py-3 text-sm"
        />
        <motion.button
          type="submit"
          disabled={!roleInput.trim() || disabled || isAnalyzing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing
            </>
          ) : (
            'Analyze'
          )}
        </motion.button>
      </div>
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm mt-2 font-medium">
          {error}
        </motion.p>
      )}
    </motion.form>
  );
}
