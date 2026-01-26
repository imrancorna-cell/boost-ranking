import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ containerClassName }: { containerClassName?: string }) {
  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label="Boost Ranking homepage"
    >
      <div className={cn('h-8 w-auto', containerClassName)}>
        <svg
          viewBox="0 0 400 150"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logo-blue-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#29abe2" />
              <stop offset="100%" stopColor="#0071bc" />
            </linearGradient>
            <linearGradient id="logo-green-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#8dc63f" />
              <stop offset="100%" stopColor="#39b54a" />
            </linearGradient>
          </defs>
          
          <g transform="translate(65, 0)">
            {/* Using a font that is bold and rounded */}
            <text
              x="145"
              y="90"
              fontFamily="'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif"
              fontSize="90"
              fontWeight="bold"
              fill="url(#logo-blue-grad)"
            >
              R
            </text>
            <g transform="translate(0, 5)">
              <rect x="135" y="45" width="15" height="40" rx="3" fill="url(#logo-green-grad)"/>
              <rect x="153" y="30" width="15" height="55" rx="3" fill="url(#logo-green-grad)"/>
              <rect x="171" y="15" width="15" height="70" rx="3" fill="url(#logo-green-grad)"/>
            </g>
            <text
              x="60"
              y="90"
              fontFamily="'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif"
              fontSize="90"
              fontWeight="bold"
              fill="url(#logo-blue-grad)"
            >
              B
            </text>

            <g transform="translate(0, -5)">
              <path
                d="M 90 100 C 130 65, 190 15, 240 20"
                stroke="url(#logo-green-grad)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M228 29 L 240 20 L 235 34 z"
                fill="url(#logo-green-grad)"
              />
            </g>
          </g>

          <text
            x="200"
            y="140"
            textAnchor="middle"
            fontFamily="'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
            fontSize="30"
            fontWeight="bold"
            fill="#333"
          >
            BOOST RANKING
          </text>
        </svg>
      </div>
    </Link>
  );
}
