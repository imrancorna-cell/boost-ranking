import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2"
      aria-label="Domain Portfolio Navigator homepage"
    >
      <Briefcase className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg font-headline tracking-tight">
        Boost Ranking
      </span>
    </Link>
  );
}
