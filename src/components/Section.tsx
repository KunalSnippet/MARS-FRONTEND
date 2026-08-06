import React from 'react';

export function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`page-section ${className}`}>{children}</section>;
}
