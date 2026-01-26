import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center"
      aria-label="Boost Ranking homepage"
    >
      <div className="h-8 w-auto">
        <svg
          viewBox="0 0 400 150"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logo-blue-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#29abe2" />
              <stop offset="1" stopColor="#1b6ca8" />
            </linearGradient>
            <linearGradient id="logo-green-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#92d050" />
              <stop offset="1" stopColor="#5c9d36" />
            </linearGradient>
          </defs>

          {/* Graphic part */}
          <g transform="translate(40, 0)">
            {/* B */}
            <text
              x="20"
              y="100"
              fontFamily="Arial, sans-serif"
              fontSize="100"
              fontWeight="bold"
              fill="url(#logo-blue-grad)"
            >
              B
            </text>

            {/* Bars */}
            <g>
              <rect
                x="145"
                y="35"
                width="20"
                height="65"
                fill="url(#logo-green-grad)"
              />
              <rect
                x="170"
                y="20"
                width="20"
                height="80"
                fill="url(#logo-green-grad)"
              />
            </g>

            {/* R */}
            <text
              x="130"
              y="100"
              fontFamily="Arial, sans-serif"
              fontSize="100"
              fontWeight="bold"
              fill="url(#logo-blue-grad)"
            >
              R
            </text>

            {/* Arrow */}
            <g>
              <path
                d="M70, 105 C 120, 50, 180, 10, 220, 5"
                stroke="url(#logo-green-grad)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
              {/* Arrowhead */}
              <path
                d="M210 15 L 220 5 L 215 20 z"
                fill="url(#logo-green-grad)"
              />
            </g>
          </g>

          {/* Text part */}
          <text
            x="200"
            y="140"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
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
