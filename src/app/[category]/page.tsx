import { getDomainsByCategory, getCategoryBySlug } from '@/lib/data';
import { DomainListClient } from '@/components/domain-list-client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }
  const domains = await getDomainsByCategory(params.category);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">{category.name}</h1>
          <p className="text-muted-foreground">
            Browse from {category.domainCount} domains available in this category.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
      </div>
      <DomainListClient domains={domains} />
    </div>
  );
}
