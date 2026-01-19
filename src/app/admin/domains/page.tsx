'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDomain, addBulkDomains } from '@/lib/data-service';
import type { Domain, DomainCategory } from '@/lib/definitions';
import { collection, query, orderBy } from 'firebase/firestore';

const domainSchema = z.object({
  url: z.string().min(3, { message: 'URL is required' }),
  da: z.coerce.number().min(0).max(100),
  tf: z.coerce.number().min(0).max(100),
  dr: z.coerce.number().min(0).max(100),
  ss: z.coerce.number().min(0).max(100),
  categorySlug: z.string().min(1, { message: 'Category is required' }),
});

const bulkSchema = z.object({
  data: z.string().min(1, { message: 'Bulk data cannot be empty' }),
  categorySlug: z.string().min(1, { message: 'Category is required' }),
});

function AddDomainForm({ categories }: { categories: DomainCategory[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: { url: '', da: 0, tf: 0, dr: 0, ss: 0, categorySlug: '' },
  });

  const onSubmit = (values: z.infer<typeof domainSchema>) => {
    startTransition(async () => {
      try {
        await addDomain(firestore, values);
        toast({ title: 'Success', description: 'Domain added successfully.' });
        form.reset();
      } catch (e: any) {
        toast({
          title: 'Error',
          description: e.message || 'Failed to add domain.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categorySlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="da"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DA</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TF</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DR</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spam Score (%)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Domain
        </Button>
      </form>
    </Form>
  );
}

function BulkAddForm({ categories }: { categories: DomainCategory[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof bulkSchema>>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { data: '', categorySlug: '' },
  });

  const onSubmit = (values: z.infer<typeof bulkSchema>) => {
    startTransition(async () => {
      try {
        const lines = values.data.split('\n').filter(line => line.trim() !== '');
        const domains: Omit<Domain, 'id'>[] = lines.map(line => {
            const [url, da, tf, dr, ss] = line.split(',').map(s => s.trim());
            return {
                url,
                da: parseInt(da) || 0,
                tf: parseInt(tf) || 0,
                dr: parseInt(dr) || 0,
                ss: parseInt(ss) || 0,
                categorySlug: values.categorySlug,
            };
        });
        await addBulkDomains(firestore, domains);
        toast({ title: 'Success', description: 'Bulk domains processed.' });
        form.reset();
      } catch (e: any) {
        toast({
          title: 'Error',
          description: e.message || 'Failed to process bulk domains.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain Data</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste data here, one domain per line. Format: url,da,tf,dr,ss"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categorySlug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category for all domains</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Bulk Domains
        </Button>
      </form>
    </Form>
  );
}

export default function AdminDomainsPage() {
  const firestore = useFirestore();
  
  const categoriesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'domainCategories'), orderBy('name')) : null, [firestore]);
  const domainsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'domains'), orderBy('url')) : null, [firestore]);

  const { data: categories, isLoading: categoriesLoading } = useCollection<DomainCategory>(categoriesQuery);
  const { data: domains, isLoading: domainsLoading } = useCollection<Domain>(domainsQuery);
  
  const isLoading = categoriesLoading || domainsLoading;

  const getCategoryName = (slug: string) => categories?.find(c => c.slug === slug)?.name || slug;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Domains</h1>
        <p className="text-muted-foreground">Add new domains to your portfolio.</p>
      </div>

      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">Add Single</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Add</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <Card>
            <CardContent className="p-6">
              <AddDomainForm categories={categories || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulk">
          <Card>
            <CardContent className="p-6">
              <BulkAddForm categories={categories || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Domains</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>DA</TableHead>
                  <TableHead>DR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : domains && domains.length > 0 ? (
                  domains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">{domain.url}</TableCell>
                      <TableCell>{getCategoryName(domain.categorySlug)}</TableCell>
                      <TableCell>{domain.da}</TableCell>
                      <TableCell>{domain.dr}</TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No domains found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
