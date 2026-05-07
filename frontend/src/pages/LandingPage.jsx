import { motion } from 'framer-motion';
import { Dna, FlaskConical } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import ResearchDomainCard from '../components/ResearchDomainCard.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-20 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-lime-200/35 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <HeroSection />

        <section id="domains" className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Pioneering Research for a Sustainable Future
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              Explore our two AI-driven research domains advancing sustainable fuels and clean chemistry.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResearchDomainCard
              icon={FlaskConical}
              title="Chemical Catalysis"
              description="AI-powered catalyst discovery and optimization for sustainable fuel conversion and advanced clean chemistry."
              domainSlug="chemical-catalysis"
              image="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80"
              accent="emerald"
            />
            <ResearchDomainCard
              icon={Dna}
              title="Synthetic Biology"
              description="AI-assisted enzyme engineering and microbial pathway optimization for sustainable biofuel innovation."
              domainSlug="synthetic-biology"
              image="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80"
              accent="teal"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
