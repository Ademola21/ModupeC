import React from 'react';

export const MusicNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.002 1.949l-4.5 2.25a2.25 2.25 0 01-2.004 0l-4.5-2.25A2.25 2.25 0 013 16.303V12.553a2.25 2.25 0 011.002-1.949l4.5-2.25a2.25 2.25 0 012.004 0l4.5 2.25z" 
    />
  </svg>
);