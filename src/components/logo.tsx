import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ containerClassName }: { containerClassName?: string }) {
  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label="Boost Ranking homepage"
    >
      <div className={cn('relative h-8 w-auto', containerClassName)}>
        <Image
          src="/logo.png"
          alt="Boost Ranking Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </Link>
  );
}
