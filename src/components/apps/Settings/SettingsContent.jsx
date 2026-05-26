import React, { useState, useContext } from "react";
import { WALLPAPER_GROUPS } from "../../../constants/wallpapers";
import { WindowContext } from "../../AppWindow/AppWindow";

// Иконки
import WiFi from "./../../../assets/icons/Settings_menuSections/Wi-Fi.png";
import Bluetooth from "./../../../assets/icons/Settings_menuSections/Bluetooth.png";

import LogoType from "./../../../assets/images/logo/logo_butterfly.png";

export function SettingsContent({ currentWallpaper, onWallpaperChange }) {
  const [activeTab, setActiveTab] = useState("wallpaper");
  const [searchQuery, setSearchQuery] = useState("");

  // Получаем функции управления окном из контекста
  const { onClose, onMinimize, onFocus, onTitleMouseDown } = useContext(WindowContext);

  // Структура меню (оставьте свою, здесь пример)
  const menuSections = [
    {
      id: "network",
      items: [
        { id: "wifi", label: "Wi-Fi", icon: WiFi, iconType: "image" },
        { id: "bluetooth", label: "Bluetooth", icon: Bluetooth, iconType: "image" },
        { id: "network", label: "Network", icon: "🌐", iconType: "image" },
        { id: "vpn", label: "VPN", icon: "🔒", iconType: "image" }
      ]
    },
    {
      id: "system",
      items: [
        { id: "notifications", label: "Notifications", icon: "🔔", iconType: "image" },
        { id: "sound", label: "Sound", icon: "🔊", iconType: "image" },
        { id: "focus", label: "Focus", icon: "🧘", iconType: "image" },
        { id: "screentime", label: "Screen Time", icon: "⏱️", iconType: "image" }
      ]
    },
    {
      id: "general",
      items: [
        { id: "general", label: "General", icon: "⚙️", iconType: "image" },
        { id: "appearance", label: "Appearance", icon: "🎨", iconType: "image" },
        { id: "accessibility", label: "Accessibility", icon: "♿", iconType: "image" },
        { id: "controlcenter", label: "Control Center", icon: "🎮", iconType: "image" },
        { id: "siri", label: "Siri & Spotlight", icon: "🔍", iconType: "image" },
        { id: "privacy", label: "Privacy & Security", icon: "🔐", iconType: "image" }
      ]
    },
    {
      id: "desktop",
      items: [
        { id: "desktopdock", label: "Desktop & Dock", icon: "🖥️", iconType: "image" },
        { id: "displays", label: "Displays", icon: "🖥️", iconType: "image" },
        { id: "wallpaper", label: "Wallpaper", icon: "🖼️", iconType: "image" },
        { id: "screensaver", label: "Screen Saver", icon: "✨", iconType: "image" },
        { id: "energysaver", label: "Energy Saver", icon: "🔋", iconType: "image" }
      ]
    },
    {
      id: "security",
      items: [
        { id: "lockscreen", label: "Lock Screen", icon: "🔒", iconType: "image" },
        { id: "loginpassword", label: "Login Password", icon: "🔑", iconType: "image" },
        { id: "usersgroups", label: "Users & Groups", icon: "👥", iconType: "image" }
      ]
    },
    {
      id: "accounts",
      items: [
        { id: "passwords", label: "Passwords", icon: "🔐", iconType: "image" },
        { id: "internetaccounts", label: "Internet Accounts", icon: "🌍", iconType: "image" },
        { id: "gamecenter", label: "Game Center", icon: "🎮", iconType: "image" }
      ]
    }
  ];

  // Фильтрация по поиску
  const filteredSections = menuSections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.includes(searchQuery.toLowerCase())
      )
    }))
    .filter(section => section.items.length > 0);

  const handleItemClick = (itemId) => {
    if (itemId === "wallpaper") setActiveTab(itemId);
    else if (itemId === "appleid") setActiveTab("about");
    else console.log(`Clicked: ${itemId} (not implemented yet)`);
  };

  // Перетаскивание за верхнюю область сайдбара (но не за input/button)
  const handleSidebarMouseDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    onFocus();
    onTitleMouseDown(e);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "wallpaper":
        return (
          <div className="settings-panel">
            <div className="panel-header">
              <h2 className="panel-title">Wallpaper</h2>
              <p className="panel-description">Choose a background image for your desktop</p>
            </div>
            {WALLPAPER_GROUPS.map((group) => (
              <div key={group.id} className="wallpaper-group">
                <h3 className="wallpaper-group-title">{group.title}</h3>
                <div className="wallpaper-grid">
                  {group.wallpapers.map((wp) => {
                    const isSelected = currentWallpaper === wp.id;
                    return (
                      <div
                        key={wp.id}
                        className={`wallpaper-card ${isSelected ? "selected" : ""}`}
                        onClick={() => onWallpaperChange?.({ id: wp.id, type: "image", value: wp.image })}
                      >
                        <div className="wallpaper-thumbnail">
                          <img src={wp.thumbnail} alt={wp.name} />
                          {isSelected && <div className="check-badge">✓</div>}
                        </div>
                        <span className="wallpaper-title">{wp.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      case "about":
        return (
          <div className="settings-panel">
            <div className="panel-header">
              <h2 className="panel-title">About This Mac</h2>
            </div>
            <div className="system-info-card">
              <div className="info-header">
                <div className="apple-logo">🍎</div>
                <div>
                  <h3>hackintosh.web</h3>
                  <p>macOS Sonoma 14.0.1</p>
                </div>
              </div>
            </div>
            <div className="info-section">
              <div className="info-row"><span className="info-label">Version</span><span className="info-value">14.0.1</span></div>
              <div className="info-row"><span className="info-label">Build</span><span className="info-value">23A344</span></div>
              <div className="info-row"><span className="info-label">Serial Number</span><span className="info-value">HACKW192K98X</span></div>
              <div className="info-row"><span className="info-label">Processor</span><span className="info-value">Apple M3 Max (Virtual)</span></div>
              <div className="info-row"><span className="info-label">Memory</span><span className="info-value">16 GB LPDDR5X</span></div>
              <div className="info-row"><span className="info-label">Graphics</span><span className="info-value">Integrated GPU (16-core)</span></div>
              <div className="info-row"><span className="info-label">Storage</span><span className="info-value">512 GB (420 GB available)</span></div>
            </div>
            <div className="info-footer">
              <p>™ & © 1983–2026 Apple Inc. All rights reserved.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="settings-panel">
            <div className="panel-header">
              <h2 className="panel-title">Settings</h2>
              <p className="panel-description">This section is not yet implemented.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings-container">
      {/* САЙДБАР с кнопками управления и перетаскиванием */}
      <div className="settings-sidebar" onMouseDown={handleSidebarMouseDown}>
        {/* Кастомные кнопки управления окном */}
        <div className="sidebar-traffic-lights">
          <button className="traffic-light traffic-light--close" onClick={onClose} />
          <button className="traffic-light traffic-light--minimize" onClick={onMinimize} />
          <button className="traffic-light traffic-light--zoom" />
        </div>

        {/* Поиск */}
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Учётная запись */}
        <div className="sidebar-apple-id">
          <div className="apple-id-avatar" aria-hidden="true">
            <div className="apple-id-avatar_logo">
              <img
                src={LogoType} 
                alt="User Avatar"
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="apple-id-info">
            <div className="apple-id-name">ghost</div>
            <div className="apple-id-email">Apple ID</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Список разделов */}
        <div className="tabs-list">
          {filteredSections.map((section, idx) => (
            <div key={section.id} className="menu-section">
              {idx > 0 && <div className="section-divider" />}
              {section.items.map(item => (
                <div
                  key={item.id}
                  className={`tab-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="tab-icon">
                    {item.iconType === "image" ? (
                      <img
                        src={item.icon}
                        alt={item.label}
                        style={{ width: 22, height: 22, objectFit: "contain", opacity: 0.7 }}
                      />
                    ) : (
                      item.icon
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

      {/* ПРАВАЯ ЧАСТЬ – КОНТЕНТ */}
      <div className="settings-content">
        {renderTabContent()}
      </div>
    </div>
  );
}