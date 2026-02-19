import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full max-w-xl mx-auto"
    >
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && !uploadComplete && !disabled && fileInputRef.current?.click()}
        whileHover={uploadComplete || isUploading || disabled ? {} : { scale: 1.01, y: -2 }}
        className={`pixel-card cursor-pointer p-8 text-center transition-all duration-300 ${
          isDragging ? 'border-purple-500 bg-purple-50/30 scale-105' : ''
        } ${error ? 'border-red-400' : ''} ${uploadComplete ? 'border-green-400 bg-green-50/30' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf,.doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-red-500"
            >
              <AlertCircle className="w-10 h-10" />
              <p className="font-semibold text-sm">Upload failed</p>
              <p className="text-xs text-center text-red-400">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                  fileInputRef.current?.click();
                }}
                className="btn-pixel text-xs px-5 py-2 mt-1"
              >
                Try Again
              </motion.button>
            </motion.div>
          ) : uploadComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-green-600"
            >
              <CheckCircle className="w-10 h-10" />
              <p className="font-semibold text-sm">Resume uploaded successfully!</p>
              <div className="flex items-center gap-2 text-xs text-green-500">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <p>Generating your roadmap…</p>
              </div>
            </motion.div>
          ) : isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 text-purple-600"
            >
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-semibold text-sm">Analyzing your resume…</p>
              <p className="text-xs text-gray-400">Extracting skills</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Upload className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm">
                  Drop your resume here
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF or DOCX · Max 5MB</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="btn-pixel text-sm px-6 py-2.5"
              >
                <FileText className="w-4 h-4" />
                Browse File
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
