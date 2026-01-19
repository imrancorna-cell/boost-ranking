'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FolderKanban,
  Globe,
  PanelLeft,
  Loader2,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/domains', label: 'Domains', icon: Globe },
  { href: '/admin/categories', label: 'Categories', icon: FolderKanban },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.isAdmin) {
            setIsAuthorized(true);
          } else {
            router.push('/'); // Redirect non-admins to homepage
          }
          setAuthChecked(true);
        });
      } else {
        const loginUrl = new URL('/login', window.location.origin);
        loginUrl.searchParams.set('next', pathname);
        router.push(loginUrl.toString());
      }
    }
  }, [user, isUserLoading, router, pathname]);

  if (!authChecked || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="hidden md:flex">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="hidden md:flex">
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 border-b bg-background flex items-center gap-4 md:hidden">
          <SidebarTrigger>
            <PanelLeft />
          </SidebarTrigger>
          <div className="font-bold text-lg">Admin Panel</div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
