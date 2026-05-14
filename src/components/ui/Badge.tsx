import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

const variantClasses = {
  success: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50',
  warning: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50',
  danger: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800/50',
  info: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
  default: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 dark:from-slate-800/40 dark:to-slate-800/20 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50',
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        'px-3 py-1.5 text-xs font-bold rounded-full inline-block whitespace-nowrap',
        'shadow-sm hover:shadow-md transition-all duration-200',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </motion.span>
  );
};