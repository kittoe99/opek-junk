import React from 'react';

/** Preserve the original logo shape while following the homepage theme color. */
export const HomeLogo: React.FC<{ className?: string; alt?: string }> = ({
  className = '',
  alt = 'Opek Junk Removal',
}) => (
  <span className="relative inline-block align-middle">
    <img src="/opek-logo-white.png" alt={alt} className={`block opacity-0 ${className}`} />
    <span
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundColor: 'var(--home-purple, #520f96)',
        mask: 'url("/opek-logo-white.png") center / contain no-repeat',
        WebkitMask: 'url("/opek-logo-white.png") center / contain no-repeat',
      }}
    />
  </span>
);
