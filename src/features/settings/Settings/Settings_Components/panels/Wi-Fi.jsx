import React, { useState } from "react";
import { SettingsPanel, SettingsGroup, ToggleSwitch } from "../SettingsPanel";
import { LockIcon, CheckmarkIcon, MoreIcon, HelpIcon, WifiSignalIcon, SpinnerIcon, HotspotLinkIcon } from "../SettingsIcons";
import wifiIcon from "../../../../../assets/icons/Settings_menuSections/Network/Wi-Fi.png";

// ═══════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS — Reusable & Pixel-Perfect
// ═══════════════════════════════════════════════════════════════════

const NetworkRow = ({ name, secured, signal, connected, onMore, isHotspot }) => (
  <div className="apple-list-row">
    <div className="row-left-content">
      <div className="checkmark-gutter">
        {connected && <CheckmarkIcon />}
      </div>
      <span className="apple-network-name">
        {name}
      </span>
    </div>
    <div className="row-right-content">
      {secured && <LockIcon />}
      {isHotspot ? <HotspotLinkIcon /> : <WifiSignalIcon level={signal} />}
      {onMore && (
        <button className="apple-icon-circle-btn" onClick={onMore}>
          <MoreIcon />
        </button>
      )}
    </div>
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="apple-system-toggle-row">
    <div className="toggle-text-block">
      <span className="toggle-main-label">{label}</span>
      {description && <p className="toggle-hint-desc">{description}</p>}
    </div>
    <div className="toggle-action-block">
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export const WiFiSettings = () => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [askToJoin, setAskToJoin] = useState(false);
  const [askToJoinHotspots, setAskToJoinHotspots] = useState(false);

  const knownNetworks = [
    { id: 1, name: "MERCUSYS_5G", secured: true, signal: 3, connected: true },
    { id: 2, name: "MERCUSYS_B939", secured: true, signal: 2, connected: false },
  ];

  return (
    <SettingsPanel title="Wi‑Fi">
      <div className="wifi-settings-wrapper">
        
        {/* ── БЛОК ТЕКУЩЕГО СТАТУСА И ВКЛЮЧЕНИЯ ── */}
        <div className="apple-settings-block">
          <SettingsGroup>
            <div className="apple-wifi-header-row">
              <div className="wifi-title-wrapper">
                <div className={`wifi-status-icon-blue ${!wifiEnabled ? "disabled" : ""}`}>
                  <img src={wifiIcon} alt="Wi-Fi" />
                </div>
                <span className="apple-label-main">Wi‑Fi</span>
              </div>
              <ToggleSwitch checked={wifiEnabled} onChange={() => setWifiEnabled(!wifiEnabled)} />
            </div>

            {wifiEnabled && (
              <div className="apple-wifi-connected-card">
                <div className="connected-card-left">
                  <span className="apple-status-dot-green" />
                  <div className="connected-meta">
                    <span className="network-title-bold">MERCUSYS_5G</span>
                    <span className="network-subtitle-status">Connected</span>
                  </div>
                </div>
                <div className="connected-card-right">
                  <LockIcon />
                  <WifiSignalIcon level={3} />
                  <button className="apple-btn-secondary">Details…</button>
                </div>
              </div>
            )}
          </SettingsGroup>
        </div>

        {/* ── ДОПОЛНИТЕЛЬНЫЕ РАЗДЕЛЫ ── */}
        {wifiEnabled && (
          <>
            <div className="apple-section-container">
              <div className="apple-section-header">Personal Hotspots</div>
              <SettingsGroup>
                <NetworkRow name="iPhone" secured={true} signal={3} connected={false} isHotspot={true} />
              </SettingsGroup>
            </div>

            <div className="apple-section-container">
              <div className="apple-section-header">Known Networks</div>
              <SettingsGroup>
                {knownNetworks.map((net) => (
                  <NetworkRow 
                    key={net.id} 
                    {...net} 
                    onMore={() => console.log("Options for:", net.name)} 
                  />
                ))}
              </SettingsGroup>
            </div>

            <div className="apple-section-container">
              <div className="apple-section-header">Other Networks</div>
              <SettingsGroup>
                <div className="apple-other-networks-box">
                  <div className="searching-status">
                    <span className="searching-text">No Networks</span>
                  </div>
                  <button className="apple-btn-secondary">Other…</button>
                </div>
              </SettingsGroup>
            </div>

            {/* Блок системных тумблеров */}
            <div className="apple-section-container">
              <SettingsGroup>
                <ToggleRow
                  label="Ask to join networks"
                  description="Known networks will be joined automatically. If no known networks are available, you will have to manually select a network."
                  checked={askToJoin}
                  onChange={() => setAskToJoin(!askToJoin)}
                />
                <ToggleRow
                  label="Ask to join hotspots"
                  description="Allow this Mac to automatically discover nearby personal hotspots when no Wi‑Fi network is available."
                  checked={askToJoinHotspots}
                  onChange={() => setAskToJoinHotspots(!askToJoinHotspots)}
                />
              </SettingsGroup>
            </div>

            {/* Нативный подвал macOS */}
            <div className="apple-footer-controls">
              <button className="apple-btn-help-circle">
                <HelpIcon />
              </button>
              <button className="apple-btn-action-panel">Advanced…</button>
            </div>
          </>
        )}
      </div>
    </SettingsPanel>
  );
};