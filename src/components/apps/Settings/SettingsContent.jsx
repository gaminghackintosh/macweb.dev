import React, { useState, useContext, useMemo, useCallback, memo } from "react";
import { WALLPAPER_GROUPS } from "../../../constants/wallpapers";
import { WindowContext } from "../../AppWindow/AppWindow";

// Icons
import WiFi_Icon      from "./../../../assets/icons/Settings_menuSections/Wi-Fi.png";
import Bluetooth_Icon from "./../../../assets/icons/Settings_menuSections/Bluetooth.png";
import Network_Icon   from "./../../../assets/icons/Settings_menuSections/Network.ico";

import GameCenter_Icon from "./../../../assets/icons/Settings_menuSections/Game_Center.png";
import Wallet_Icon    from "./../../../assets/icons/Settings_menuSections/Wallet.png";

import LogoType  from "./../../../assets/images/logo/logo_butterfly.png";

// Shared components
import { SettingsPanel } from "./Settings_Components/SettingsPanel";
import { SettingsGroup  } from "./Settings_Components/SettingsGroup";
import { SettingsRow    } from "./Settings_Components/SettingsRow";
import { ToggleSwitch } from "./Settings_Components/ToggleSwitch";

// Import Components Settings
import {
  WiFiSettings,
  AccessibilitySettings,
  AppearanceSettings,
  BluetoothSettings,
  ControlCenterSettings,
  DesktopDockSettings,
  DisplaysSettings,
  EnergySaverSettings,
  FocusSettings,
  GameCenterSettings,
  GameControllersSettings,
  GeneralSettings,
  InternetAccountsSettings,
  LockScreenSettings,
  LoginPasswordSettings,
  MouseSettings,
  NetworkSettings,
  NotificationsSettings,
  PasswordsSettings,
  PrivacySettings,
  SoundSettings,
  VPNSettings,
} from "./Settings_Components/panels";

// ─── Menu structure ──────────────────────────────────────────────────────────

const MENU_SECTIONS = [
  {
    id: "network",
    items: [
      { id: "wifi",      label: "Wi-Fi",      icon: WiFi_Icon,      iconType: "image" },
      { id: "bluetooth", label: "Bluetooth",  icon: Bluetooth_Icon, iconType: "image" },
      { id: "network",   label: "Network",    icon: Network_Icon,   iconType: "image" },
      { id: "vpn",       label: "VPN",        icon: "🔒",      iconType: "emoji" },
    ],
  },
  {
    id: "system",
    items: [
      { id: "notifications", label: "Notifications", icon: "🔔", iconType: "emoji" },
      { id: "sound",         label: "Sound",          icon: "🔊", iconType: "emoji" },
      { id: "focus",         label: "Focus",          icon: "🧘", iconType: "emoji" },
      { id: "screentime",    label: "Screen Time",    icon: "⏱️", iconType: "emoji" },
    ],
  },
  {
    id: "general",
    items: [
      { id: "general",       label: "General",            icon: "⚙️", iconType: "emoji" },
      { id: "appearance",    label: "Appearance",         icon: "🎨", iconType: "emoji" },
      { id: "accessibility", label: "Accessibility",      icon: "♿", iconType: "emoji" },
      { id: "controlcenter", label: "Control Center",     icon: "🎮", iconType: "emoji" },
      { id: "siri",          label: "Siri & Spotlight",   icon: "🔍", iconType: "emoji" },
      { id: "privacy",       label: "Privacy & Security", icon: "🔐", iconType: "emoji" },
    ],
  },
  {
    id: "desktop",
    items: [
      { id: "desktopdock",  label: "Desktop & Dock", icon: "🖥️", iconType: "emoji" },
      { id: "displays",     label: "Displays",        icon: "🖥️", iconType: "emoji" },
      { id: "wallpaper",    label: "Wallpaper",       icon: "🖼️", iconType: "emoji" },
      { id: "screensaver",  label: "Screen Saver",    icon: "✨", iconType: "emoji" },
      { id: "energysaver",  label: "Energy Saver",    icon: "🔋", iconType: "emoji" },
    ],
  },
  {
    id: "security",
    items: [
      { id: "lockscreen",    label: "Lock Screen",    icon: "🔒", iconType: "emoji" },
      { id: "loginpassword", label: "Login Password", icon: "🔑", iconType: "emoji" },
      { id: "usersgroups",   label: "Users & Groups", icon: "👥", iconType: "emoji" },
    ],
  },
  {
    id: "accounts",
    items: [
      { id: "passwords",         label: "Passwords",           icon: "🔐", iconType: "emoji" },
      { id: "internetaccounts",  label: "Internet Accounts",   icon: "🌍", iconType: "emoji" },
      { id: "gamecenter",        label: "Game Center",         icon: GameCenter_Icon, iconType: "image" },
      { id: "wallet",            label: "Wallet & Apple Pay",  icon: Wallet_Icon, iconType: "image" },
    ],
  },
  {
    id: "hardware",
    items: [
      { id: "keyboard",           label: "Keyboard",           icon: "⌨️", iconType: "emoji" },
      { id: "mouse",              label: "Mouse",              icon: "🖱️", iconType: "emoji" },
      { id: "gamecontrollers",    label: "Game Controllers",   icon: "🎮", iconType: "emoji" },
      { id: "printersscanners",   label: "Printers & Scanners",icon: "🖨️", iconType: "emoji" },
    ],
  },
];

// ─── Tab content renderer (memoized) ──────────────────────────────────────────
const renderTab = (activeTab, currentWallpaper, onWallpaperChange) => {
  switch (activeTab) {
    case "wifi":             return <WiFiSettings />;
    case "bluetooth":        return <BluetoothSettings />;
    case "network":          return <NetworkSettings />;
    case "vpn":              return <VPNSettings />;
    
    case "notifications":    return <NotificationsSettings />;
    case "sound":            return <SoundSettings />;
    case "focus":            return <FocusSettings />;
    
    case "general":          return <GeneralSettings />;
    case "appearance":       return <AppearanceSettings />;
    case "accessibility":    return <AccessibilitySettings />;
    case "controlcenter":    return <ControlCenterSettings />;
    case "privacy":          return <PrivacySettings />;
    
    case "desktopdock":      return <DesktopDockSettings />;
    case "displays":         return <DisplaysSettings />;
    case "energysaver":      return <EnergySaverSettings />;
    
    case "lockscreen":       return <LockScreenSettings />;
    case "loginpassword":    return <LoginPasswordSettings />;
    
    case "passwords":        return <PasswordsSettings />;
    case "internetaccounts": return <InternetAccountsSettings />;
    case "gamecenter":       return <GameCenterSettings />;
    
    case "mouse":            return <MouseSettings />;
    case "gamecontrollers":  return <GameControllersSettings />;

    // Неподдерживаемые разделы - показываем заглушку
    case "screentime":
    case "siri":
    case "usersgroups":
    case "wallet":
    case "keyboard":
    case "printersscanners":
    case "screensaver":
      return (
        <SettingsPanel title={activeTab === "screentime" ? "Screen Time" : 
                               activeTab === "siri" ? "Siri & Spotlight" :
                               activeTab === "usersgroups" ? "Users & Groups" :
                               activeTab === "wallet" ? "Wallet & Apple Pay" :
                               activeTab === "keyboard" ? "Keyboard" :
                               activeTab === "printersscanners" ? "Printers & Scanners" :
                               "Screen Saver"}>
          <SettingsGroup>
            <SettingsRow label="This section is not yet implemented." />
          </SettingsGroup>
        </SettingsPanel>
      );

    case "wallpaper":
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
                    >
                      <div className="wallpaper-thumbnail">
                        <img 
                          src={wp.thumbnail} 
                          alt={wp.name} 
                          loading="lazy"
                        />
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

    case "about":
      return (
        <SettingsPanel title="About This Mac">
          <SettingsGroup>
            <div className="about-header">
              <div className="about-logo">🍎</div>
              <div className="about-info">
                <div className="about-name">hackintosh.web</div>
                <div className="about-version">macOS Sonoma 14.0.1</div>
              </div>
            </div>
          </SettingsGroup>
          <SettingsGroup>
            <SettingsRow label="Version"       value="14.0.1" />
            <SettingsRow label="Build"         value="23A344" />
            <SettingsRow label="Serial Number" value="HACKW192K98X" />
            <SettingsRow label="Processor"     value="Apple M3 Max (Virtual)" />
            <SettingsRow label="Memory"        value="16 GB LPDDR5X" />
            <SettingsRow label="Graphics"      value="Integrated GPU (16-core)" />
            <SettingsRow label="Storage"       value="512 GB (420 GB available)" />
          </SettingsGroup>
          <p className="about-footer">™ & © 1983–2026 Apple Inc. All rights reserved.</p>
        </SettingsPanel>
      );

    default:
      return (
        <SettingsPanel title={activeTab}>
          <SettingsGroup>
            <SettingsRow label="This section is not yet implemented." />
          </SettingsGroup>
        </SettingsPanel>
      );
  }
};

// ─── Main component ───────────────────────────────────────────────────────────

export const SettingsContent = memo(function SettingsContent({ currentWallpaper, onWallpaperChange }) {
  const [activeTab,   setActiveTab]   = useState("wallpaper");
  const [searchQuery, setSearchQuery] = useState("");

  const { onClose, onMinimize, onFocus, onTitleMouseDown, onZoom } = useContext(WindowContext);

  // Memoized filtered sidebar items
  const filteredSections = useMemo(() => 
    MENU_SECTIONS
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter(section => section.items.length > 0),
    [searchQuery]
  );

  const handleItemClick = useCallback((id) => {
    setActiveTab(id === "appleid" ? "about" : id);
  }, []);

  const handleSidebarMouseDown = useCallback((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    onFocus();
    onTitleMouseDown(e);
  }, [onFocus, onTitleMouseDown]);

  const handleWallpaperChange = useCallback((wp) => {
    onWallpaperChange?.(wp);
  }, [onWallpaperChange]);

  // Memoized render tab content
  const tabContent = useMemo(() => 
    renderTab(activeTab, currentWallpaper, handleWallpaperChange),
    [activeTab, currentWallpaper, handleWallpaperChange]
  );

  return (
    <div className="settings-container">
      {/* ── SIDEBAR ── */}
      <div className="settings-sidebar" onMouseDown={handleSidebarMouseDown}>

        {/* Traffic lights */}
        <div className="sidebar-traffic-lights">
          <button className="traffic-light traffic-light--close"    onClick={onClose} />
          <button className="traffic-light traffic-light--minimize" onClick={onMinimize} />
          <button className="traffic-light traffic-light--zoom" onClick={onZoom} />
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Apple ID card */}
        <div
          className={`sidebar-apple-id${activeTab === "about" ? " active" : ""}`}
          onClick={() => handleItemClick("appleid")}
        >
          <div className="apple-id-avatar">
            <img src={LogoType} alt="User Avatar" />
          </div>
          <div className="apple-id-info">
            <div className="apple-id-name">ghost</div>
            <div className="apple-id-email">Apple ID</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Menu list */}
        <div className="tabs-list">
          {filteredSections.map((section, idx) => (
            <div key={section.id} className="menu-section">
              {idx > 0 && <div className="section-divider" />}
              {section.items.map(item => (
                <div
                  key={item.id}
                  className={`tab-item${activeTab === item.id ? " active" : ""}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="tab-icon">
                    {item.iconType === "image" ? (
                      <img src={item.icon} alt={item.label} />
                    ) : (
                      <span>{item.icon}</span>
                    )}
                  </span>
                  <span className="tab-label">{item.label}</span>
                  {item.badge && <span className="tab-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="settings-content">
        {tabContent}
      </div>
    </div>
  );
});
