import { motion } from 'framer-motion';

export default function LightCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border border-emerald-100 bg-white shadow-sm shadow-emerald-900/5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
