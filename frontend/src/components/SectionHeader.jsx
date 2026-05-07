export default function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </div>
  );
}
