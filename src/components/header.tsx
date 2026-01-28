'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { LayoutDashboard, LogOut, Loader2, UploadCloud } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

function AuthButton() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.isAdmin);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (isUserLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <LayoutDashboard />
              Admin
            </Link>
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button asChild size="sm">
      <Link href="/login">Login</Link>
    </Button>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button size="sm">
              <UploadCloud />
              Publish
            </Button>
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
