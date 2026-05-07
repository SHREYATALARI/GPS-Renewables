import { motion } from 'framer-motion';

export default function SustainabilityButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  const styles =
    variant === 'primary'
      ? 'bg-[#3FAE49] text-white hover:bg-[#369740] border-transparent'
      : 'bg-white text-[#2f7f37] border border-emerald-200 hover:border-emerald-400';

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
