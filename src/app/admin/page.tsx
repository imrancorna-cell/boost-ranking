'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FolderKanban, Globe, Loader2 } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Domain, DomainCategory } from '@/lib/definitions';
import { useMemo } from 'react';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const domainsQuery = useMemo(
    () => (firestore ? collection(firestore, 'domains') : null),
    [firestore]
  );
  const categoriesQuery = useMemo(
    () => (firestore ? collection(firestore, 'domancategorie') : null),
    [firestore]
  );

  const { data: domains, isLoading: domainsLoading } =
    useCollection<Domain>(domainsQuery);
  const { data: categories, isLoading: categoriesLoading } =
    useCollection<DomainCategory>(categoriesQuery);

  const isLoading = domainsLoading || categoriesLoading;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your domain portfolio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{domains?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">
                {categories?.length || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Domain groups configured
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>
            From this panel you can manage domain categories and add new domains
            to your portfolio. After creating a user, you'll need to set their{' '}
            <code>isAdmin</code> custom claim to <code>true</code> to grant them
            admin access. This is typically done via a script using the Firebase
            Admin SDK.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Use the navigation on the left to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
