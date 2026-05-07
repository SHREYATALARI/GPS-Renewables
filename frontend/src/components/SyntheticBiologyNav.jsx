import { NavLink } from 'react-router-dom';

const ITEMS = [
  ['Dashboard', '/synthetic-biology/dashboard'],
  ['Research', '/synthetic-biology/research'],
  ['Pathways', '/synthetic-biology/pathways'],
  ['Proteins', '/synthetic-biology/proteins'],
  ['Experiments', '/synthetic-biology/experiments'],
  ['Collaboration', '/synthetic-biology/collaboration'],
];

export default function SyntheticBiologyNav() {
  return (
    <div className="flex flex-wrap gap-2">
      {ITEMS.map(([label, href]) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            `text-xs px-3 py-1.5 rounded-full border transition ${
              isActive
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-emerald-100 text-slate-600 hover:border-emerald-200'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
