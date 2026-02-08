import React from 'react';

/**
 * Zikora Logo Component
 *
 * Usage:
 *   <ZikoraLogo />                          — Full logo (icon + text), orange on dark
 *   <ZikoraLogo variant="icon" />            — Ant icon only
 *   <ZikoraLogo variant="text" />            — Text only
 *   <ZikoraLogo size="sm" />                 — Small (24px height)
 *   <ZikoraLogo size="md" />                 — Medium (40px height, default)
 *   <ZikoraLogo size="lg" />                 — Large (64px height)
 *   <ZikoraLogo color="#F0B90B" />           — Custom color (BNB gold)
 *   <ZikoraLogo textColor="#1A1A2E" />       — Custom text color (for light bg)
 *   <ZikoraLogo variant="favicon" />         — Square favicon (ant in rounded rect)
 *   <ZikoraLogo variant="token" />           — Circular token icon
 */

const sizes = {
  xs: { height: 20, iconScale: 0.35, fontSize: 14, spacing: 3, letterSpacing: 2 },
  sm: { height: 28, iconScale: 0.5,  fontSize: 18, spacing: 4, letterSpacing: 3 },
  md: { height: 40, iconScale: 0.7,  fontSize: 26, spacing: 5, letterSpacing: 5 },
  lg: { height: 64, iconScale: 1.0,  fontSize: 40, spacing: 7, letterSpacing: 7 },
  xl: { height: 88, iconScale: 1.4,  fontSize: 56, spacing: 9, letterSpacing: 9 },
};

function AntIcon({ color = '#FF6B2C', scale = 1 }) {
  const w = 56 * scale;
  const h = 86 * scale;

  return (
    <svg width={w} height={h} viewBox="0 0 56 86" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antennae */}
      <line x1="22" y1="12" x2="17" y2="1" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <line x1="34" y1="12" x2="39" y2="1" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {/* Head */}
      <circle cx="28" cy="20" r="11" fill={color} />
      {/* Thorax */}
      <circle cx="28" cy="42" r="9" fill={color} />
      {/* Abdomen */}
      <circle cx="28" cy="68" r="15" fill={color} />
    </svg>
  );
}

function LogoText({ color = '#F0EDE6', fontSize = 26, letterSpacing = 5 }) {
  return (
    <span
      style={{
        fontFamily: "'Syne', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}px`,
        color,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      ZIKORA
    </span>
  );
}

export default function ZikoraLogo({
  variant = 'full',      // 'full' | 'icon' | 'text' | 'favicon' | 'token'
  size = 'md',            // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color = '#FF6B2C',      // Icon/accent color
  textColor = '#F0EDE6',  // Text color
  className = '',
}) {
  const s = sizes[size] || sizes.md;

  // Favicon variant — ant inside rounded square
  if (variant === 'favicon') {
    const dim = s.height * 1.4;
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="48" height="48" rx="10" fill="#12121A" />
        <line x1="21" y1="10" x2="19" y2="5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <line x1="27" y1="10" x2="29" y2="5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <circle cx="24" cy="14" r="5" fill={color} />
        <circle cx="24" cy="24" r="4" fill={color} />
        <circle cx="24" cy="36" r="6.5" fill={color} />
      </svg>
    );
  }

  // Token variant — ant inside circle
  if (variant === 'token') {
    const dim = s.height * 1.6;
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="64" cy="64" r="64" fill={color} />
        <line x1="58" y1="30" x2="54" y2="18" stroke="#12121A" strokeWidth={3.5} strokeLinecap="round" />
        <line x1="70" y1="30" x2="74" y2="18" stroke="#12121A" strokeWidth={3.5} strokeLinecap="round" />
        <circle cx="64" cy="36" r="11" fill="#12121A" />
        <circle cx="64" cy="60" r="9" fill="#12121A" />
        <circle cx="64" cy="88" r="14" fill="#12121A" />
      </svg>
    );
  }

  // Icon only
  if (variant === 'icon') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <AntIcon color={color} scale={s.iconScale} />
      </div>
    );
  }

  // Text only
  if (variant === 'text') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <LogoText color={textColor} fontSize={s.fontSize} letterSpacing={s.letterSpacing} />
      </div>
    );
  }

  // Full logo (icon + text)
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${s.spacing * 2}px`,
      }}
    >
      <AntIcon color={color} scale={s.iconScale} />
      <LogoText color={textColor} fontSize={s.fontSize} letterSpacing={s.letterSpacing} />
    </div>
  );
}

// Named exports for convenience
export { AntIcon, LogoText };
