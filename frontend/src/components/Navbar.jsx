import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 shadow-sm shadow-emerald-900/5 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-700">GPS Renewables</p>
            <p className="text-xs font-medium text-emerald-600">Research and Development</p>
          </div>
        </Link>
      </nav>
    </header>
  );
}
