'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase, type WithId } from '@/firebase';
import { addCategory } from '@/lib/data-service';
import type { Domain, DomainCategory } from '@/lib/definitions';
import { collection, query, orderBy } from 'firebase/firestore';

const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Category name must be at least 3 characters' }),
});

function AddCategoryDialog() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: z.infer<typeof categorySchema>) => {
    // No transition needed for non-blocking write
    try {
        addCategory(firestore, values.name);
        toast({
          title: 'Success',
          description: `Category "${values.name}" is being created.`,
        });
        setOpen(false);
        form.reset();
      } catch (e: any) {
        // This catch block may not be hit if the error is handled globally.
        let description = e.message || 'Failed to create category.';
        if (e.code === 'permission-denied') {
          description = "Admin privileges required. Please use the /become-admin page to grant access.";
        }
        toast({
          title: 'Error',
          description,
          variant: 'destructive',
        });
      }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category to group your domains.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Premium Domains"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCategoriesPage() {
  const firestore = useFirestore();
  const categoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'domainCategories'), orderBy('name')) : null,
    [firestore]
  );
  const { data: categories, isLoading } = useCollection<DomainCategory>(categoriesQuery);

  const domainsQuery = useMemoFirebase(
    () => firestore ? collection(firestore, 'domains') : null,
    [firestore]
  );
  const { data: domains } = useCollection<Domain>(domainsQuery);

  const domainCounts = (categories || []).reduce((acc, category) => {
    const count = (domains || []).filter(d => d.categorySlug === category.slug).length;
    return {...acc, [category.id]: count};
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Manage Categories
          </h1>
          <p className="text-muted-foreground">
            View, create, and manage your domain categories.
          </p>
        </div>
        <AddCategoryDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
          <CardDescription>
            A list of all the categories in your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Domains</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="text-right">{domainCounts[category.id] || 0}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
