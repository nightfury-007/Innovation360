import type { SVGProps } from 'react';

export function VmSentinelLogo(props: SVGProps<SVGSVGElement>) {
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
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="10" y1="6" x2="10.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
      <line x1="10" y1="18" x2="10.01" y2="18" />
    </svg>
  );
}
