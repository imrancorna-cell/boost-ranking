'use client';

import { DomainListClient } from '@/components/domain-list-client';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Domain, DomainCategory } from '@/lib/definitions';
import { useMemo } from 'react';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const firestore = useFirestore();

  const allCategoriesQuery = useMemo(
    () => (firestore ? collection(firestore, 'domancategorie') : null),
    [firestore]
  );

  const domainsQuery = useMemo(
    () =>
      firestore && categorySlug
        ? query(collection(firestore, 'domains'), where('categorySlug', '==', categorySlug))
        : null,
    [firestore, categorySlug]
  );

  const { data: allCategories, isLoading: categoryLoading } =
    useCollection<DomainCategory>(allCategoriesQuery);
  const { data: domains, isLoading: domainsLoading } = useCollection<Domain>(domainsQuery);

  const category = useMemo(
    () => allCategories?.find((c) => c.slug === categorySlug),
    [allCategories, categorySlug]
  );

  if (categoryLoading || domainsLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">
            Browse from {domains?.length || 0} domains available in this category.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
      </div>
      <DomainListClient domains={domains || []} />
    </div>
  );
}
