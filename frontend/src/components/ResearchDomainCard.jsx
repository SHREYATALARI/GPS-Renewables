import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ResearchDomainCard({
  icon: Icon,
  title,
  description,
  image,
  domainSlug,
  accent = 'emerald',
}) {
  const accentStyles =
    accent === 'teal'
      ? 'from-teal-500/90 to-emerald-500/90 border-teal-300/50'
      : 'from-emerald-500/90 to-lime-500/90 border-emerald-300/50';

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className={`relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-xl shadow-xl shadow-emerald-900/10 ${accentStyles.split(' ')[2]}`}
    >
      <div className="absolute inset-0">
        <img src={image} alt={title} className="h-full w-full object-cover opacity-20" />
        <div className={`absolute inset-0 bg-gradient-to-br ${accentStyles.split(' ').slice(0, 2).join(' ')} opacity-15`} />
      </div>
      <div className="relative p-7 md:p-8">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={domainSlug === 'synthetic-biology' ? '/synthetic-biology/dashboard' : '/dashboard'}
            className="rounded-full border border-emerald-300 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500"
          >
            Open Workspace
          </Link>
          <Link
            to={`/login?domain=${domainSlug}`}
            className="rounded-full border border-emerald-300 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500"
          >
            Login
          </Link>
          <Link
            to={`/signup?domain=${domainSlug}`}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
