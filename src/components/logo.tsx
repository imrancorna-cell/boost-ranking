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
      <div className={cn('relative w-24 aspect-[400/150]', containerClassName)}>
        <Image
          src="/logo.png"
          alt="Boost Ranking Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </Link>
  );
}
