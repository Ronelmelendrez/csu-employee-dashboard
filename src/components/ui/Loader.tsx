import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
      />
    </div>
  );
};