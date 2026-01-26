'use client';

import Link from 'next/link';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { DomainCategory, Domain } from '@/lib/definitions';
import { useCollection, useFirestore, type WithId } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { Logo } from '@/components/logo';

function CategoryCard({
  category,
  domainCount,
}: {
  category: WithId<DomainCategory>;
  domainCount: number;
}) {
  return (
    <Link href={`/${category.slug}`} className="group block">
      <Card className="h-full rounded-2xl transition-all duration-300 ease-in-out shadow-lg shadow-accent/25 group-hover:shadow-xl group-hover:shadow-accent/40 group-hover:-translate-y-2">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          <CardTitle className="text-xl font-bold text-primary">{category.name}</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {domainCount} {domainCount === 1 ? 'domain' : 'domains'}
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
        ? query(collection(firestore, 'domancategorie'), orderBy('name'))
        : null,
    [firestore]
  );
  const domainsQuery = useMemo(
    () => (firestore ? collection(firestore, 'domains') : null),
    [firestore]
  );

  const { data: categories, isLoading: categoriesLoading } =
    useCollection<DomainCategory>(categoriesQuery);
  const { data: domains } = useCollection<Domain>(domainsQuery);

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
      <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/50 -z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 animate-[spin_20s_linear_infinite] [background-image:radial-gradient(hsla(var(--primary)/0.2)_1px,transparent_1px),radial-gradient(hsla(var(--accent)/0.2)_1px,transparent_1px)] [background-size:2rem_2rem] [background-position:0_0,1rem_1rem]"
        />

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <Logo containerClassName="w-48 h-auto" />
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Navigate Your Digital Assets
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                An elegant, simple, and powerful platform to manage and browse
                your domain portfolio with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-20 -mt-16">
        <div className="container px-4 md:px-6">
          {categoriesLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
