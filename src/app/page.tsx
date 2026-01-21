'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ArrowRight, Folder, Globe, Shield, Loader2 } from 'lucide-react';
import type { DomainCategory, Domain } from '@/lib/definitions';
import { useCollection, useFirestore, type WithId } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';

const iconMap: { [key: string]: React.ReactNode } = {
  'general-domains': <Globe className="h-8 w-8 text-primary" />,
  'premium-domains': <Shield className="h-8 w-8 text-primary" />,
  'other-domains': <Folder className="h-8 w-8 text-primary" />,
};

function CategoryCard({
  category,
  domainCount,
}: {
  category: WithId<DomainCategory>;
  domainCount: number;
}) {
  return (
    <Link href={`/${category.slug}`} className="group block">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            {iconMap[category.slug] || (
              <Folder className="h-8 w-8 text-primary" />
            )}
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
          <CardDescription className="mt-1">
            {domainCount} domains
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  const firestore = useFirestore();

  const categoriesQuery = useMemo(
    () =>
      firestore
        ? query(collection(firestore, 'domaincategorie'), orderBy('name'))
        : null,
    [firestore]
  );
  const domainsQuery = useMemo(
    () => (firestore ? collection(firestore, 'domains') : null),
    [firestore]
  );

  const { data: categories, isLoading: categoriesLoading } =
    useCollection<WithId<DomainCategory>>(categoriesQuery);
  const { data: domains } = useCollection<WithId<Domain>>(domainsQuery);

  const categoryDomainCounts = useMemo(() => {
    if (!domains) return {};
    return domains.reduce(
      (acc, domain) => {
        acc[domain.categorySlug] = (acc[domain.categorySlug] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [domains]);

  return (
    <div className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                Explore Our Domain Portfolio
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover a curated selection of domains organized by category.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-20">
        <div className="container px-4 md:px-6">
          {categoriesLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories?.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  domainCount={categoryDomainCounts[category.slug] || 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
