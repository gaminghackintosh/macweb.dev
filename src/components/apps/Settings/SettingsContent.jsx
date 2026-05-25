import React, { useState } from "react";
import { WALLPAPERS, DEFAULT_WALLPAPER, getWallpaperById } from "../../../constants/wallpapers";

export function SettingsContent({ currentWallpaper, onWallpaperChange }) {
  const [activeTab, setActiveTab] = useState("about");
  const [appearance, setAppearance] = useState("auto");
  const [accentColor, setAccentColor] = useState("blue");
  const [sidebarSize, setSidebarSize] = useState("medium");

  const tabs = [
    { id: "about", label: "About This Mac", icon: "🍎" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "wallpaper", label: "Wallpaper", icon: "🖼️" },
    { id: "displays", label: "Displays", icon: "📺" },
    { id: "dock", label: "Dock", icon: "⚙️" },
    { id: "battery", label: "Battery", icon: "🔋" },
    { id: "wifi", label: "Wi-Fi", icon: "📶" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  const accentColors = [
    { id: "multi", name: "Multicolor", color: "linear-gradient(45deg, #ff3b30, #ff9500, #ffcc00, #34c759, #00b4d8, #0a84ff, #5856d6, #af52de)" },
    { id: "blue", name: "Blue", color: "#0a84ff" },
    { id: "purple", name: "Purple", color: "#af52de" },
    { id: "pink", name: "Pink", color: "#ff2d55" },
    { id: "red", name: "Red", color: "#ff3b30" },
    { id: "orange", name: "Orange", color: "#ff9500" },
    { id: "yellow", name: "Yellow", color: "#ffcc00" },
    { id: "green", name: "Green", color: "#34c759" },
    { id: "gray", name: "Gray", color: "#8e8e93" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      // ===== ABOUT THIS MAC =====
      case "about":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">About This Mac</h2>
            
            <div className="system-info-card">
              <div className="info-header">
                <div className="apple-logo">🍎</div>
                <div>
                  <h3>hackintosh.web</h3>
                  <p>macOS Sonoma</p>
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-row">
                <span className="info-label">Version</span>
                <span className="info-value">14.0.1</span>
              </div>
              <div className="info-row">
                <span className="info-label">Build</span>
                <span className="info-value">23A344</span>
              </div>
              <div className="info-row">
                <span className="info-label">Serial Number</span>
                <span className="info-value">HACKW192K98X</span>
              </div>
              <div className="info-row">
                <span className="info-label">Processor</span>
                <span className="info-value">Apple M3 Max (Virtual)</span>
              </div>
              <div className="info-row">
                <span className="info-label">Memory</span>
                <span className="info-value">16 GB LPDDR5X</span>
              </div>
              <div className="info-row">
                <span className="info-label">Graphics</span>
                <span className="info-value">Integrated GPU (16-core)</span>
              </div>
              <div className="info-row">
                <span className="info-label">Storage</span>
                <span className="info-value">512 GB (420 GB available)</span>
              </div>
            </div>

            <div className="info-footer">
              <p>™ & © 1983-2026 Apple Inc. All rights reserved.</p>
            </div>
          </div>
        );

      // ===== APPEARANCE =====
      case "appearance":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">Appearance</h2>

            <div className="settings-section">
              <h3 className="section-title">Appearance</h3>
              <div className="appearance-options">
                {["light", "dark", "auto"].map((opt) => (
                  <div
                    key={opt}
                    className={`appearance-option ${appearance === opt ? "selected" : ""}`}
                    onClick={() => setAppearance(opt)}
                  >
                    <div className="appearance-preview">
                      {opt === "light" && (
                        <div style={{
                          background: "linear-gradient(to bottom, #f5f5f5, #ffffff)",
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                          display: "flex",
                          flexDirection: "column",
                          padding: 8,
                          gap: 4,
                        }}>
                          <div style={{ height: 6, background: "#e5e5ea", borderRadius: 2 }}></div>
                          <div style={{ height: 4, background: "#e5e5ea", borderRadius: 2, width: "80%" }}></div>
                        </div>
                      )}
                      {opt === "dark" && (
                        <div style={{
                          background: "linear-gradient(to bottom, #2a2a2e, #1c1c1e)",
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                          display: "flex",
                          flexDirection: "column",
                          padding: 8,
                          gap: 4,
                        }}>
                          <div style={{ height: 6, background: "#636366", borderRadius: 2 }}></div>
                          <div style={{ height: 4, background: "#636366", borderRadius: 2, width: "80%" }}></div>
                        </div>
                      )}
                      {opt === "auto" && (
                        <div style={{
                          background: "linear-gradient(90deg, #f5f5f5 50%, #1c1c1e 50%)",
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                        }}></div>
                      )}
                    </div>
                    <span className="appearance-label">{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3 className="section-title">Accent color</h3>
              <div className="color-grid">
                {accentColors.map((color) => (
                  <div
                    key={color.id}
                    className={`color-option ${accentColor === color.id ? "selected" : ""}`}
                    onClick={() => setAccentColor(color.id)}
                    title={color.name}
                  >
                    <div
                      className="color-dot"
                      style={{ background: color.color }}
                    >
                      {accentColor === color.id && <span className="checkmark">✓</span>}
                    </div>
                    {color.id === "multi" && <span className="color-label">{color.name}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3 className="section-title">Sidebar icon size</h3>
              <div className="size-options">
                {["small", "medium", "large"].map((size) => (
                  <label key={size} className="radio-option">
                    <input
                      type="radio"
                      name="sidebar-size"
                      value={size}
                      checked={sidebarSize === size}
                      onChange={(e) => setSidebarSize(e.target.value)}
                    />
                    <span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <div className="toggle-option">
                <div>
                  <h4>Allow wallpaper tinting in windows</h4>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      // ===== WALLPAPER =====
      case "wallpaper":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">Wallpaper</h2>
            <p className="panel-description">Select a background for your desktop</p>

            <div className="wallpaper-grid">
              {WALLPAPERS.map((wp) => {
                const isSelected = currentWallpaper === wp.id;
                return (
                  <div
                    key={wp.id}
                    className={`wallpaper-card ${isSelected ? "selected" : ""}`}
                    onClick={() => onWallpaperChange && onWallpaperChange(wp)}
                  >
                    <div
                      className="wallpaper-thumbnail"
                      style={{ background: wp.gradient }}
                    >
                      {isSelected && <div className="wallpaper-check">✓</div>}
                    </div>
                    <span className="wallpaper-title">{wp.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // ===== DISPLAYS =====
      case "displays":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">Displays</h2>

            <div className="info-section">
              <div className="display-preview">
                <div className="monitor-bezel">
                  <div className="monitor-screen">
                    {window.innerWidth} × {window.innerHeight}
                  </div>
                </div>
              </div>

              <div className="info-row">
                <span className="info-label">Resolution</span>
                <span className="info-value">Built-in Retina Display</span>
              </div>
              <div className="info-row">
                <span className="info-label">Refresh Rate</span>
                <span className="info-value">120 Hz (ProMotion)</span>
              </div>
              <div className="info-row">
                <span className="info-label">Color Profile</span>
                <span className="info-value">Apple Display P3</span>
              </div>
              <div className="info-row">
                <span className="info-label">Brightness</span>
                <span className="info-value">75%</span>
              </div>
            </div>
          </div>
        );

      // ===== DOCK =====
      case "dock":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">Dock</h2>

            <div className="settings-section">
              <div className="slider-option">
                <div>
                  <h4>Size</h4>
                  <p className="option-description">Small → Large</p>
                </div>
                <input type="range" min="0" max="100" defaultValue="50" className="slider" />
              </div>

              <div className="toggle-option">
                <div>
                  <h4>Magnification</h4>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-option">
                <div>
                  <h4>Animate opening applications</h4>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-option">
                <div>
                  <h4>Automatically hide and show the Dock</h4>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3 className="section-title">Dock Position on screen</h3>
              <div className="radio-group">
                {["bottom", "left", "right"].map((pos) => (
                  <label key={pos} className="radio-option">
                    <input type="radio" name="dock-pos" value={pos} defaultChecked={pos === "bottom"} />
                    <span>{pos.charAt(0).toUpperCase() + pos.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      // ===== BATTERY =====
      case "battery":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">Battery</h2>

            <div className="battery-card">
              <div className="battery-status">
                <span className="battery-emoji">🔋</span>
                <div className="battery-info">
                  <h3>100%</h3>
                  <p>Fully Charged • Power Adapter Connected</p>
                </div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-row">
                <span className="info-label">Maximum Capacity</span>
                <span className="info-value">99%</span>
              </div>
              <div className="info-row">
                <span className="info-label">Condition</span>
                <span className="info-value" style={{ color: "#34c759" }}>Normal</span>
              </div>
              <div className="info-row">
                <span className="info-label">Health Management</span>
                <span className="info-value">Enabled</span>
              </div>
            </div>
          </div>
        );

      // ===== WI-FI =====
      case "wifi":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">Wi-Fi</h2>

            <div className="settings-section">
              <div className="toggle-option">
                <div>
                  <h4>Wi-Fi</h4>
                  <p className="option-description">Connected to Hackintosh_Network_5G</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3 className="section-title">Known Networks</h3>
              <div className="network-list">
                {["Hackintosh_Network_5G", "Apple_Guest_Secure", "Starbucks_Free_WiFi"].map((net, idx) => (
                  <div key={net} className="network-item">
                    <div>
                      <h4>{net}</h4>
                      {idx === 0 && <p className="option-description">Connected • 🔒</p>}
                    </div>
                    {idx === 0 && <span className="network-status">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ===== NOTIFICATIONS =====
      case "notifications":
        return (
          <div className="settings-panel">
            <h2 className="panel-title">Notifications</h2>

            <div className="settings-section">
              <div className="toggle-option">
                <div>
                  <h4>Allow notifications</h4>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-option">
                <div>
                  <h4>Show notifications on lock screen</h4>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="toggle-option">
                <div>
                  <h4>Show notification previews</h4>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <div className="sidebar-header">
          <h1>System Settings</h1>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>
        <div className="tabs-list">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="settings-content">
        {renderTabContent()}
      </div>
    </div>
  );
}