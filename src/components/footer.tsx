'use client';

import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Logo />
          <p className="text-muted-foreground text-sm max-w-xs">
            Boost your SEO with our portfolio of high-authority domains.
            Quality, filtered, and ready for your network.
          </p>
          <a
            href="https://www.fiverr.com/ibrkjj2/build-high-quality-dofollow-backlinks-authority-pa-da-seo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>

        <div className="mt-12 border-t pt-8 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Boost Ranking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
