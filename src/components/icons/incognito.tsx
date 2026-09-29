import React from 'react';

export function IncognitoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Incognito Icon</title>
      {/* Hat */}
      <path d="M3 11h18" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      {/* Glasses */}
      <circle cx="7" cy="16" r="2.5" />
      <circle cx="17" cy="16" r="2.5" />
      <path d="M9.5 16h5" />
    </svg>
  );
}
