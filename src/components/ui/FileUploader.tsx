import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FiUpload } from 'react-icons/fi';
import { parseExcelToEmployees } from '../../utils/excelParser';
import { useEmployees } from '../../hooks/useEmployees';
import { useAppStore } from '../../store/appStore';

export const FileUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateEmployees } = useEmployees();
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setError(null);
      return await parseExcelToEmployees(file);
    },
    onSuccess: (data) => {
      updateEmployees(data);
      setIsLoading(false);
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
      <label
        htmlFor="file-upload"
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors"
      >
        <FiUpload size={18} />
        <span>Upload Excel</span>
      </label>
      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-100 text-red-800 text-sm px-3 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
};