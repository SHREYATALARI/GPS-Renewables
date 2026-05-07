import { motion } from 'framer-motion';
import SustainabilityImageGrid from './SustainabilityImageGrid.jsx';

export default function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-10 md:px-8 lg:grid-cols-2 lg:items-center lg:pt-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          AI-Powered Innovation for a Sustainable Future
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Driving Clean Energy through{' '}
          <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
            AI &amp; Science
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
          GPS Renewables is building an AI-powered catalyst and synthetic biology discovery platform for sustainable fuels, carbon conversion, and clean energy innovation.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <SustainabilityImageGrid />
      </motion.div>
    </section>
  );
}
