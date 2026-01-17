import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { logout } from '@/lib/actions';
import { LayoutDashboard, LogOut } from 'lucide-react';

async function AuthButton() {
  const session = await getSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session.isAdmin && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
        )}
        <form action={logout}>
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
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
          <nav className="flex items-center space-x-1">
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
