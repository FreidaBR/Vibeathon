import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { validateGitHub, validateLinkedIn } from '../lib/api';

export default function ProfileLinks({ githubUrl, linkedInUrl, onGitHubChange, onLinkedInChange, onValidationChange }) {
  const [githubValid, setGitHubValid] = useState(null);
  const [linkedInValid, setLinkedInValid] = useState(null);
  const [validatingGitHub, setValidatingGitHub] = useState(false);
  const [validatingLinkedIn, setValidatingLinkedIn] = useState(false);
  const [githubError, setGitHubError] = useState(null);
  const [linkedInError, setLinkedInError] = useState(null);

  async function handleGitHubBlur() {
    const url = (githubUrl || '').trim();
    if (!url) {
      setGitHubValid(null);
      setGitHubError(null);
      onValidationChange?.({ githubValid: false });
      return;
    }
    setValidatingGitHub(true);
    setGitHubError(null);
    try {
      const res = await validateGitHub(url);
      setGitHubValid(res.valid);
      setGitHubError(res.valid ? null : res.error);
      onValidationChange?.({ githubValid: res.valid });
    } catch {
      setGitHubValid(false);
      setGitHubError('Validation failed');
      onValidationChange?.({ githubValid: false });
    } finally {
      setValidatingGitHub(false);
    }
  }

  async function handleLinkedInBlur() {
    const url = (linkedInUrl || '').trim();
    if (!url) {
      setLinkedInValid(null);
      setLinkedInError(null);
      onValidationChange?.({ linkedInValid: false });
      return;
    }
    setValidatingLinkedIn(true);
    setLinkedInError(null);
    try {
      const res = await validateLinkedIn(url);
      setLinkedInValid(res.valid);
      setLinkedInError(res.valid ? null : res.error);
      onValidationChange?.({ linkedInValid: res.valid });
    } catch {
      setLinkedInValid(false);
      setLinkedInError('Validation failed');
      onValidationChange?.({ linkedInValid: false });
    } finally {
      setValidatingLinkedIn(false);
    }
  }

  const InputField = ({ icon: Icon, value, onChange, onBlur, placeholder, validating, valid, error }) => (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 z-10" />
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="input-pixel pl-11 pr-11 py-3 text-sm"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {validating && <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />}
        {!validating && valid === true && <CheckCircle className="w-5 h-5 text-emerald-500" />}
        {!validating && valid === false && <XCircle className="w-5 h-5 text-red-500" />}
      </div>
      {error && <p className="text-sm text-red-600 mt-2 font-medium">{error}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full"
    >
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        3. Profile Links <span className="font-normal normal-case text-gray-400">(optional)</span>
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          icon={Github}
          value={githubUrl}
          onChange={onGitHubChange}
          onBlur={handleGitHubBlur}
          placeholder="https://github.com/username"
          validating={validatingGitHub}
          valid={githubValid}
          error={githubError}
        />
        <InputField
          icon={Linkedin}
          value={linkedInUrl}
          onChange={onLinkedInChange}
          onBlur={handleLinkedInBlur}
          placeholder="https://linkedin.com/in/username"
          validating={validatingLinkedIn}
          valid={linkedInValid}
          error={linkedInError}
        />
      </div>
    </motion.div>
  );
}
