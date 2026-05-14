import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FiUpload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { parseExcelToEmployees } from '../../utils/excelParser';
import { useEmployees } from '../../hooks/useEmployees';
import { useAppStore } from '../../store/appStore';

export const FileUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateEmployees } = useEmployees();
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setError(null);
      return await parseExcelToEmployees(file);
    },
    onSuccess: (data) => {
      updateEmployees(data);
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: Error) => {
      setError(err.message);
      setIsLoading(false);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
        id="file-upload"
      />
      <motion.label
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        htmlFor="file-upload"
        className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
      >
        <motion.div animate={uploadMutation.isPending ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity }}>
          <FiUpload size={18} />
        </motion.div>
        <span>{uploadMutation.isPending ? 'Uploading...' : 'Upload Excel'}</span>
      </motion.label>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <FiAlertCircle size={16} />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 backdrop-blur text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <FiCheckCircle size={16} />
            Upload successful!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};