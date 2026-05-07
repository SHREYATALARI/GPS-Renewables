import { motion } from 'framer-motion';

export default function FloatingInfoCard({ label, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl border border-emerald-100 bg-white/85 px-4 py-2.5 shadow-lg backdrop-blur-md ${className}`}
    >
      <p className="text-xs font-semibold tracking-wide text-emerald-700">{label}</p>
    </motion.div>
  );
}
