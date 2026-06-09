// ═══════════════════════════════════════════════════════════════════
//  Settings Icons — Shared SVG Icons (No Duplication)
// ═══════════════════════════════════════════════════════════════════

export const LockIcon = () => (
  <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor">
    <path d="M6 1.5A3.5 3.5 0 0 0 2.5 5v2h7V5A3.5 3.5 0 0 0 6 1.5zm4.5 5.5h-9A1.5 1.5 0 0 0 0 8.5v4A1.5 1.5 0 0 0 1.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 10.5 7z" />
  </svg>
);

export const CheckmarkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2 6 5 9 10 3" />
  </svg>
);

export const MoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const WifiSignalIcon = ({ level = 0 }) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 4.5} y={10 - (i + 1) * 2.5} width="3" height={(i + 1) * 2.5} rx="0.5" opacity={i < level ? 1 : 0.15} />
    ))}
  </svg>
);

export const SpinnerIcon = () => (
  <svg className="spinner-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

export const HotspotLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const DisconnectedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 0 1 0 10.72" opacity="0.4"/>
    <path d="M5.64 6.64a9 9 0 0 0 0 10.72" opacity="0.4"/>
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

// Device icons for Bluetooth
export const HeadphonesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

export const KeyboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h8"/>
  </svg>
);

export const MouseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="7"/>
    <path d="M12 6v4"/>
  </svg>
);
