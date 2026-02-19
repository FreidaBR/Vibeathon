import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadResume } from '../lib/api';

export default function ResumeUpload({ onUploadComplete, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  async function processFile(file) {
    setError(null);
    setIsUploading(true);

    try {
      const result = await uploadResume(file);
      setUploadComplete(true);
      setTimeout(() => onUploadComplete?.(result), 500);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
        2. Resume
      </label>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && !uploadComplete && !disabled && fileInputRef.current?.click()}
        whileHover={uploadComplete || isUploading || disabled ? {} : { scale: 1.01 }}
        className={`pixel-card cursor-pointer p-6 text-center transition-all duration-300 ${
          isDragging ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-200' : ''
        } ${error ? 'border-red-300 bg-red-50/30' : ''} ${uploadComplete ? 'border-emerald-300 bg-emerald-50/30' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Upload failed</p>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  fileInputRef.current?.click();
                }}
                className="btn-pixel text-sm px-5 py-2.5"
              >
                Try Again
              </motion.button>
            </motion.div>
          ) : uploadComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Resume uploaded successfully</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                  <span>Generating your roadmap...</span>
                </div>
              </div>
            </motion.div>
          ) : isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-5"
            >
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <div>
                <p className="font-semibold text-gray-800">Analyzing your resume</p>
                <p className="text-sm text-gray-500 mt-1">Full AI analysis in progress</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center border-2 border-dashed border-indigo-200">
                <Upload className="w-7 h-7 text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Drop resume or click</p>
                <p className="text-xs text-gray-500 mt-0.5">PDF · DOCX · 5MB max</p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="btn-pixel text-xs px-4 py-2"
              >
                Choose File
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
