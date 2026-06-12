import { memo } from "react";

// ═══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const WIFI_NAME = "Kernel Panic Network";

export const APPLE_MENU_OPTIONS = Object.freeze([
      { id: "about", label: "About This Mac" },
  { id: "div1", type: "divider" },
      { id: "settings", label: "System Settings…" },
      { id: "appstore", label: "App Store…" },
  { id: "div2", type: "divider" },
      { id: "recent", label: "Recent Items", submenu: true },
  { id: "div3", type: "divider" },
      { id: "force", label: "Force Quit", dynamicApp: true, shortcut: "⌥⇧⌘Q" },
  { id: "div4", type: "divider" },
      { id: "sleep", label: "Sleep" },
      { id: "restart", label: "Restart…" },
      { id: "shutdown", label: "Shut Down…" },
  { id: "div5", type: "divider" },
      { id: "lock", label: "Lock Screen", shortcut: "⌃⌘Q" },
      { id: "logout", label: "Log Out", dynamicUser: true, shortcut: "⇧⌘Q" },
]);

export const MENU_OPTIONS = Object.freeze({
  File: ["New Folder", "New Window", "Open…", "Close Window"],
  Edit: ["Undo", "Redo", "Cut", "Copy", "Paste", "Select All"],
  View: ["Show Sidebar", "Show Path Bar", "Sort By", "Clean Up"],
  Window: ["Minimize", "Zoom", "Bring All to Front", "Close Window"],
  Help: ["Search", "About This Mac"],
});

// ═══════════════════════════════════════════════════════════════════
//  SVG ICONS (memoized)
// ═══════════════════════════════════════════════════════════════════

export const AirDropIcon = memo(({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 1a7 7 0 1 0 0 14A7 7 0 0 0 12 1zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 12 3zM6 17c0-2.76 2.69-5 6-5s6 2.24 6 5v.5H6V17z"/>
    <path d="M9.5 16.5 12 12l2.5 4.5h-5z" opacity=".7"/>
  </svg>
));

export const StageManagerIcon = memo(({ size = 15 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <rect x="2" y="4" width="13" height="16" rx="2" opacity="0.5"/>
    <rect x="9" y="4" width="13" height="16" rx="2"/>
  </svg>
));

export const ScreenMirroringIcon = memo(({ size = 15 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <rect x="2" y="4" width="20" height="14" rx="2"/>
    <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const SoundIcon = memo(({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M18.36 5.64a8 8 0 0 1 0 11.31"/>
  </svg>
));

export const ThemeIcon = memo(({ size = 18, isLight }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    {isLight ? (
      <>
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </>
    ) : (
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
    )}
  </svg>
));

export const FocusIcon = memo(({ size = 17 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <circle cx="12" cy="12" r="10" opacity="0.2"/>
    <circle cx="12" cy="12" r="6" opacity="0.5"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
));
