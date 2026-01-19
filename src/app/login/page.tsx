'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
        const next = searchParams.get('next')
        router.push(next || '/admin');
    }
  }, [user, isUserLoading, router, searchParams]);

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, values.email, values.password);
          toast({
            title: 'Account Created',
            description: "You've been signed up. Please sign in.",
          });
          setIsSignUp(false);
          form.reset();
        } else {
          await signInWithEmailAndPassword(auth, values.email, values.password);
          // Redirect is handled by the useEffect
        }
      } catch (error) {
        const authError = error as AuthError;
        let description = 'An unexpected error occurred.';
        if (authError.code === 'auth/invalid-credential') {
            description = 'Invalid email or password. Please try again.';
        } else if (authError.code === 'auth/email-already-in-use') {
            description = 'This email is already in use. Please sign in instead.'
        }
        toast({
          title: isSignUp ? 'Sign Up Failed' : 'Login Failed',
          description,
          variant: 'destructive',
        });
      }
    });
  };
  
  if (isUserLoading || user) {
      return (
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {isSignUp ? 'Create an Account' : 'Admin Login'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your email and password to sign up.'
              : 'Enter your credentials to access the admin panel.'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isPending}
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
