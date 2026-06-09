import React, { useState, useContext, useMemo, useCallback, memo } from "react";
import { WALLPAPER_GROUPS } from "@/core/constants/wallpapers";
import { WindowContext } from "@/windows";
import appleIdAvatar from "@/assets/images/logo/logo_butterfly.png";

// Network Icons
import WiFi_Icon from "@/assets/icons/Settings_menuSections/Network/Wi-Fi.png";
import Bluetooth_Icon from "@/assets/icons/Settings_menuSections/Network/Bluetooth.png";
import Network_Icon from "@/assets/icons/Settings_menuSections/Network/Network.ico";
import Vpn_Icon from "@/assets/icons/Settings_menuSections/Network/VPN.png";

// Other Icons
import Notification_Icon from "@/assets/icons/Settings_menuSections/Second_Part/notifications.png";
import Sounds_Icon from "@/assets/icons/Settings_menuSections/Second_Part/Sounds.webp";
import Focus_Icon from "@/assets/icons/Settings_menuSections/Second_Part/Focus.webp";
import ScreenTime_Icon from "@/assets/icons/Settings_menuSections/Second_Part/Screen_Time.webp";
import GeneralSettings_Icon from "@/assets/icons/apps/Light_Themes/settings_1.png";
import Appearance_Icon from "@/assets/icons/Settings_menuSections/General/Appearance.png";
import Accessibility_Icon from "@/assets/icons/Settings_menuSections/General/Accessibility.png";
import ControlCenter_Icon from "@/assets/icons/Settings_menuSections/General/Control_Center.svg";
import Siri_Icon from "@/assets/icons/Settings_menuSections/General/Siri.webp";
import Security_Icon from "@/assets/icons/Settings_menuSections/General/security_privacy.png";
import DesktopAndDock_Icon from "@/assets/icons/Settings_menuSections/Personalization/DesktopAndDock.png";
import Displays_Icon from "@/assets/icons/Settings_menuSections/Personalization/Displays.png";
import Wallpapers_Icon from "@/assets/icons/Settings_menuSections/Personalization/Wallpapers.png";
import ScreenSaver_Icon from "@/assets/icons/Settings_menuSections/Personalization/ScreenSaver.svg";
import EnergySaver_Icon from "@/assets/icons/Settings_menuSections/Personalization/Energy_Saver.svg";
import LockScreen_Icon from "@/assets/icons/Settings_menuSections/Security/lockScreen.svg";
import LoginPass_Icon from "@/assets/icons/Settings_menuSections/Security/LoginPass.svg";
import Users_Icon from "@/assets/icons/Settings_menuSections/Security/Users.png";
import Pass_Icon from "@/assets/icons/Settings_menuSections/OtherPart/Passwords_dark.png";
import Mail_Icon from "@/assets/icons/Settings_menuSections/OtherPart/mail.png";
import GameCenter_Icon from "@/assets/icons/Settings_menuSections/OtherPart/Game_Center.png";
import Wallet_Icon from "@/assets/icons/Settings_menuSections/OtherPart/Wallet.png";

// Components
import { SettingsPanel } from "./Settings_Components/SettingsPanel";
import { SettingsGroup } from "./Settings_Components/SettingsPanel";
import {
  AccessibilitySettings, AppearanceSettings, BluetoothSettings, ControlCenterSettings,
  DesktopDockSettings, DisplaysSettings, EnergySaverSettings, FocusSettings,
  GameCenterSettings, GameControllersSettings, GeneralSettings, InternetAccountsSettings,
  LockScreenSettings, LoginPasswordSettings, MouseSettings, NetworkSettings,
  NotificationsSettings, PasswordsSettings, PrivacySettings, SoundSettings,
  UsersSettings, VPNSettings, WiFiSettings,
} from "./Settings_Components/panels";

// ─── Menu structure ──────────────────────────────────────────────────────────
const MENU_SECTIONS = [
  {
    id: "network",
    items: [
      { id: "wifi", label: "Wi‑Fi", icon: WiFi_Icon, iconType: "image" },
      { id: "bluetooth", label: "Bluetooth", icon: Bluetooth_Icon, iconType: "image" },
      { id: "network", label: "Network", icon: Network_Icon, iconType: "image" },
      { id: "vpn", label: "VPN", icon: Vpn_Icon, iconType: "image" },
    ],
  },
  {
    id: "system",
    items: [
      { id: "notifications", label: "Notifications", icon: Notification_Icon, iconType: "image" },
      { id: "sound", label: "Sound", icon: Sounds_Icon, iconType: "image" },
      { id: "focus", label: "Focus", icon: Focus_Icon, iconType: "image" },
      { id: "screentime", label: "Screen Time", icon: ScreenTime_Icon, iconType: "image" },
    ],
  },
  {
    id: "general",
    items: [
      { id: "general", label: "General", icon: GeneralSettings_Icon, iconType: "image" },
      { id: "appearance", label: "Appearance", icon: Appearance_Icon, iconType: "image" },
      { id: "accessibility", label: "Accessibility", icon: Accessibility_Icon, iconType: "image" },
      { id: "controlcenter", label: "Control Center", icon: ControlCenter_Icon, iconType: "image" },
      { id: "siri", label: "Siri & Spotlight", icon: Siri_Icon, iconType: "image" },
      { id: "privacy", label: "Privacy & Security", icon: Security_Icon, iconType: "image" },
    ],
  },
  {
    id: "desktop",
    items: [
      { id: "desktopdock", label: "Desktop & Dock", icon: DesktopAndDock_Icon, iconType: "image" },
      { id: "displays", label: "Displays", icon: Displays_Icon, iconType: "image" },
      { id: "wallpaper", label: "Wallpaper", icon: Wallpapers_Icon, iconType: "image" },
      { id: "screensaver", label: "Screen Saver", icon: ScreenSaver_Icon, iconType: "image" },
      { id: "energysaver", label: "Energy Saver", icon: EnergySaver_Icon, iconType: "image" },
    ],
  },
  {
    id: "security",
    items: [
      { id: "lockscreen", label: "Lock Screen", icon: LockScreen_Icon, iconType: "image" },
      { id: "loginpassword", label: "Login Password", icon: LoginPass_Icon, iconType: "image" },
      { id: "usersgroups", label: "Users & Groups", icon: Users_Icon, iconType: "image" },
    ],
  },
  {
    id: "accounts",
    items: [
      { id: "passwords", label: "Passwords", icon: Pass_Icon, iconType: "image" },
      { id: "internetaccounts", label: "Internet Accounts", icon: Mail_Icon, iconType: "image" },
      { id: "gamecenter", label: "Game Center", icon: GameCenter_Icon, iconType: "image" },
      { id: "wallet", label: "Wallet & Apple Pay", icon: Wallet_Icon, iconType: "image" },
    ],
  },
  {
    id: "hardware",
    items: [
      { id: "keyboard", label: "Keyboard", icon: "⌨️", iconType: "emoji" },
      { id: "mouse", label: "Mouse", icon: "🖱️", iconType: "emoji" },
      { id: "gamecontrollers", label: "Game Controllers", icon: "🎮", iconType: "emoji" },
      { id: "printersscanners", label: "Printers & Scanners", icon: "🖨️", iconType: "emoji" },
    ],
  },
];

// ─── Unimplemented Panel ─────────────────────────────────────────────────────
const UnimplementedPanel = memo(({ title }) => (
  <SettingsPanel title={title}>
    <div className="unimplemented-placeholder">
      <div className="unimplemented-icon">🚧</div>
      <h3>{title}</h3>
      <p>This section is under development.</p>
    </div>
  </SettingsPanel>
));

// ─── Apple ID Avatar ─────────────────────────────────────────────────────────
const AppleIdAvatar = memo(() => (
  <div className="apple-id-avatar">
    <img src={appleIdAvatar} alt="Apple ID Avatar" loading="lazy" />
  </div>
));

// ─── Wallpaper Panel ─────────────────────────────────────────────────────────
const WallpaperPanel = memo(function WallpaperPanel({ currentWallpaper, onWallpaperChange }) {
  return (
    <SettingsPanel title="Wallpaper" description="Choose a background image for your desktop">
      {WALLPAPER_GROUPS.map((group) => (
        <div key={group.id} className="wallpaper-group">
          <h3 className="wallpaper-group-title">{group.title}</h3>
          <div className="wallpaper-grid">
            {group.wallpapers.map((wp) => {
              const isSelected = currentWallpaper === wp.id;
              return (
                <div
                  key={wp.id}
                  className={`wallpaper-card${isSelected ? " selected" : ""}`}
                  onClick={() => onWallpaperChange?.({ id: wp.id, type: "image", value: wp.image })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onWallpaperChange?.({ id: wp.id, type: "image", value: wp.image });
                    }
                  }}
                >
                  <div className="wallpaper-thumbnail">
                    <img src={wp.thumbnail} alt={wp.name} loading="lazy" decoding="async" />
                    {isSelected && <div className="check-badge">✓</div>}
                  </div>
                  <span className="wallpaper-title">{wp.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </SettingsPanel>
  );
});

// ─── About Panel ─────────────────────────────────────────────────────────────
const AboutPanel = memo(() => (
  <SettingsPanel title="About This Mac">
    <SettingsGroup>
      <div className="about-header">
        <div className="about-logo">🍎</div>
        <div className="about-info">
          <div className="about-name">hackintosh.web</div>
          <div className="about-version">macOS Sonoma 14.0.1</div>
          <div className="about-copyright">™ & © 1983–2026 Apple Inc. All rights reserved.</div>
        </div>
      </div>
    </SettingsGroup>
    <SettingsGroup title="System Information">
      <div className="sr-row"><div className="sr-left"><div className="sr-label">macOS Version</div></div><div className="sr-right"><div className="sr-value">14.0.1 (23A344)</div></div></div>
      <div className="sr-row"><div className="sr-left"><div className="sr-label">Chip</div></div><div className="sr-right"><div className="sr-value">Apple M3 Max (Virtual)</div></div></div>
      <div className="sr-row"><div className="sr-left"><div className="sr-label">Memory</div></div><div className="sr-right"><div className="sr-value">16 GB LPDDR5X</div></div></div>
      <div className="sr-row"><div className="sr-left"><div className="sr-label">Serial Number</div></div><div className="sr-right"><div className="sr-value">HACKW192K98X</div></div></div>
    </SettingsGroup>
  </SettingsPanel>
));

// ─── Panels Map ──────────────────────────────────────────────────────────────
const PANELS = {
  wifi: WiFiSettings,
  bluetooth: BluetoothSettings,
  network: NetworkSettings,
  vpn: VPNSettings,
  notifications: NotificationsSettings,
  sound: SoundSettings,
  focus: FocusSettings,
  general: GeneralSettings,
  appearance: AppearanceSettings,
  accessibility: AccessibilitySettings,
  controlcenter: ControlCenterSettings,
  privacy: PrivacySettings,
  desktopdock: DesktopDockSettings,
  displays: DisplaysSettings,
  energysaver: EnergySaverSettings,
  lockscreen: LockScreenSettings,
  loginpassword: LoginPasswordSettings,
  passwords: PasswordsSettings,
  internetaccounts: InternetAccountsSettings,
  gamecenter: GameCenterSettings,
  mouse: MouseSettings,
  gamecontrollers: GameControllersSettings,
  usersgroups: UsersSettings,
  screentime: () => <UnimplementedPanel title="Screen Time" />,
  siri: () => <UnimplementedPanel title="Siri & Spotlight" />,
  wallet: () => <UnimplementedPanel title="Wallet & Apple Pay" />,
  keyboard: () => <UnimplementedPanel title="Keyboard" />,
  printersscanners: () => <UnimplementedPanel title="Printers & Scanners" />,
  screensaver: () => <UnimplementedPanel title="Screen Saver" />,
};

// ─── Render Tab ──────────────────────────────────────────────────────────────
const renderTab = (activeTab, currentWallpaper, onWallpaperChange) => {
  if (activeTab === "wallpaper") return <WallpaperPanel currentWallpaper={currentWallpaper} onWallpaperChange={onWallpaperChange} />;
  if (activeTab === "about" || activeTab === "appleid") return <AboutPanel />;
  const PanelComponent = PANELS[activeTab];
  return PanelComponent ? <PanelComponent /> : <UnimplementedPanel title={activeTab} />;
};

// ─── Main Component ──────────────────────────────────────────────────────────
export const SettingsContent = memo(function SettingsContent({ currentWallpaper, onWallpaperChange }) {
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { onClose, onMinimize, onFocus, onTitleMouseDown, onZoom } = useContext(WindowContext);

  const handleZoom = useCallback(() => {
    setIsExpanded(prev => !prev);
    onZoom?.();
  }, [onZoom]);

  const filteredSections = useMemo(() =>
    MENU_SECTIONS
      .map(section => ({ ...section, items: section.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())) }))
      .filter(section => section.items.length > 0),
    [searchQuery]
  );

  const handleItemClick = useCallback((id) => setActiveTab(id === "appleid" ? "about" : id), []);
  const handleWallpaperChange = useCallback((wp) => onWallpaperChange?.(wp), [onWallpaperChange]);

  const tabContent = useMemo(() => renderTab(activeTab, currentWallpaper, handleWallpaperChange), [activeTab, currentWallpaper, handleWallpaperChange]);

  const renderIcon = useCallback((item) => {
    if (item.iconType === "image") return <img src={item.icon} alt={item.label} loading="lazy" />;
    if (item.iconType === "svg") { const IconComponent = item.icon; return <IconComponent size={20} />; }
    if (item.iconType === "emoji") return <span>{item.icon}</span>;
    return null;
  }, []);

  return (
    <div className="settings-container">
      {/* ── SIDEBAR ── */}
      <div className="settings-sidebar">
        <div className="sidebar-drag-handle" onMouseDown={(e) => { if (e.target.closest('button, input')) return; onFocus(); onTitleMouseDown(e); }}>
          <div className="sidebar-traffic-lights">
            <button className="traffic-light traffic-light--close" onClick={onClose} aria-label="Close" />
            <button className="traffic-light traffic-light--minimize" onClick={onMinimize} aria-label="Minimize" />
            <button className="traffic-light traffic-light--zoom" onClick={handleZoom} aria-label="Zoom" />
          </div>
        </div>

        <div className="sidebar-search">
          <input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} aria-label="Search settings" />
        </div>

        <div className={`sidebar-apple-id${activeTab === "about" ? " active" : ""}`} onClick={() => handleItemClick("appleid")} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleItemClick("appleid"); } }}>
          <AppleIdAvatar />
          <div className="apple-id-info">
            <div className="apple-id-name">ghost</div>
            <div className="apple-id-email">Apple ID</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="tabs-list" role="tablist">
          {filteredSections.map((section, idx) => (
            <div key={section.id} className="menu-section">
              {idx > 0 && <div className="section-divider" />}
              {section.items.map(item => (
                <div key={item.id} className={`tab-item${activeTab === item.id ? " active" : ""}`} onClick={() => handleItemClick(item.id)} role="tab" aria-selected={activeTab === item.id} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleItemClick(item.id); } }}>
                  <span className="tab-icon">{renderIcon(item)}</span>
                  <span className="tab-label">{item.label}</span>
                  {item.badge && <span className="tab-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className={`settings-content${isExpanded ? " settings-content--expanded" : ""}`} role="tabpanel">
        {tabContent}
      </div>
    </div>
  );
});
