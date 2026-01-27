'use client';

import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { DomainCategory } from '@/lib/definitions';
import { Logo } from './logo';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useMemo } from 'react';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
];

export function SiteFooter() {
  const firestore = useFirestore();
  const categoriesQuery = useMemo(
    () =>
      firestore
        ? query(collection(firestore, 'domancategorie'), orderBy('name'))
        : null,
    [firestore]
  );
  const { data: categories } = useCollection<DomainCategory>(categoriesQuery);

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About Section */}
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm max-w-xs">
              Boost your SEO with our portfolio of high-authority domains.
              Quality, filtered, and ready for your network.
            </p>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Section */}
          <div>
             <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
                <li>
                   <Link
                    href="/admin"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                </li>
            </ul>
          </div>
          
          {/* Social Links Section */}
          <div>
             <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Follow Us
            </h3>
             <div className="mt-4 flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Boost Ranking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
