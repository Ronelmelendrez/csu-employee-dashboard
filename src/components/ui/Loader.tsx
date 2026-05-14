import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="relative w-16 h-16">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border-4 border-transparent border-t-primary-600 border-r-secondary-600 rounded-full"
        />
        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 border-4 border-transparent border-b-primary-400 border-l-secondary-400 rounded-full"
        />
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full" />
        </motion.div>
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-sm font-medium text-slate-600 dark:text-slate-400"
      >
        Loading...
      </motion.p>
    </div>
  );
};