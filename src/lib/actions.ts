'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession, removeSession } from '@/lib/auth';
import { addCategory, addDomain, addBulkDomains } from '@/lib/data';
import type { Domain, UserSession } from './definitions';
import { revalidatePath } from 'next/cache';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function login(
  values: z.infer<typeof loginSchema>,
  next?: string | null
) {
  const parsedCredentials = loginSchema.safeParse(values);

  if (!parsedCredentials.success) {
    return { error: 'Invalid credentials.' };
  }

  const { username, password } = parsedCredentials.data;

  // Simple hardcoded credential check
  if (
    (username === 'admin' && password === 'password') ||
    (username === 'user' && password === 'password')
  ) {
    const user: UserSession = {
      username,
      isAdmin: username === 'admin',
    };
    await createSession(user);
    redirect(next || (user.isAdmin ? '/admin' : '/'));
  } else {
    return { error: 'Invalid username or password' };
  }
}

export async function logout() {
  await removeSession();
  redirect('/login');
}

const categorySchema = z
  .string()
  .min(3, { message: 'Category name must be at least 3 characters' });

export async function addCategoryAction(name: string) {
  try {
    const validatedName = categorySchema.parse(name);
    const newCategory = await addCategory(validatedName);
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data: newCategory };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: 'An unexpected error occurred.',
    };
  }
}

const domainSchema = z.object({
    url: z.string().min(3, { message: 'URL is required' }),
    da: z.coerce.number().min(0).max(100),
    tf: z.coerce.number().min(0).max(100),
    dr: z.coerce.number().min(0).max(100),
    ss: z.coerce.number().min(0).max(100),
    categorySlug: z.string().min(1, { message: 'Category is required' }),
});

export async function addDomainAction(values: z.infer<typeof domainSchema>) {
    try {
        const validatedDomain = domainSchema.parse(values);
        const newDomain = await addDomain(validatedDomain);
        revalidatePath('/admin/domains');
        revalidatePath(`/${validatedDomain.categorySlug}`);
        revalidatePath('/');
        return { success: true, data: newDomain };
    } catch(error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors.map(e => e.message).join(', ') };
        }
        return { success: false, error: "Failed to add domain." };
    }
}

const bulkSchema = z.object({
    data: z.string().min(1, { message: 'Bulk data cannot be empty' }),
    categorySlug: z.string().min(1, { message: 'Category is required' }),
  });
  
export async function addBulkDomainsAction(values: z.infer<typeof bulkSchema>) {
    try {
        const validatedBulk = bulkSchema.parse(values);
        const lines = validatedBulk.data.split('\n').filter(line => line.trim() !== '');
        const domains: Omit<Domain, 'id'>[] = lines.map(line => {
            const [url, da, tf, dr, ss] = line.split(',').map(s => s.trim());
            return {
                url,
                da: parseInt(da) || 0,
                tf: parseInt(tf) || 0,
                dr: parseInt(dr) || 0,
                ss: parseInt(ss) || 0,
                categorySlug: validatedBulk.categorySlug,
            };
        });
        
        await addBulkDomains(domains);

        revalidatePath('/admin/domains');
        revalidatePath(`/${validatedBulk.categorySlug}`);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors.map(e => e.message).join(', ') };
        }
        return { success: false, error: 'Failed to process bulk domains. Check data format.' };
    }
}
