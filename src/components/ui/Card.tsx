import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'gradient';
}

export const Card = ({ children, className, onClick, variant = 'default' }: CardProps) => {
  const baseStyles = clsx(
    'rounded-xl transition-all duration-300 border',
    onClick && 'cursor-pointer'
  );

  const variantStyles = {
    default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600',
    primary: 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-800 dark:to-slate-800/50 border-primary-200 dark:border-primary-900/30 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-800/50',
    gradient: 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white border-primary-700 dark:border-secondary-700 shadow-lg hover:shadow-xl',
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </motion.div>
  );
};