import React, { useState } from "react";
import { SettingsPanel } from "../SettingsPanel";
import { SettingsGroup } from "../SettingsGroup";
import { ToggleSwitch } from "../ToggleSwitch";
import wifiIcon from "./../../../../../assets/icons/Settings_menuSections/Network/Wi-Fi.png";

// ═══════════════════════════════════════════════════════════════════
//  SVG ICONS — Optimized & Reusable
// ═══════════════════════════════════════════════════════════════════

const LockIcon = () => (
  <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor" className="apple-icon">
    <path d="M6 1.5A3.5 3.5 0 0 0 2.5 5v2h7V5A3.5 3.5 0 0 0 6 1.5zm4.5 5.5h-9A1.5 1.5 0 0 0 0 8.5v4A1.5 1.5 0 0 0 1.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 10.5 7z" />
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="apple-checkmark">
    <polyline points="2 6 5 9 10 3" />
  </svg>
);

const MoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const HotspotLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const WifiSignalIcon = ({ level = 0 }) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={i * 4.5}
        y={10 - (i + 1) * 2.5}
        width="3"
        height={(i + 1) * 2.5}
        rx="0.5"
        opacity={i < level ? 1 : 0.15}
      />
    ))}
  </svg>
);

const SpinnerIcon = () => (
  <svg className="spinner-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS — Clean & Reusable
// ═══════════════════════════════════════════════════════════════════

const NetworkRow = ({ name, secured, signal, connected, onMore }) => (
  <div className="apple-list-row">
    <div className="row-left-content">
      <div className="checkmark-gutter">
        {connected && <CheckmarkIcon />}
      </div>
      <span className={`apple-network-name ${connected ? "active-bold" : ""}`}>
        {name}
      </span>
    </div>
    <div className="row-right-content">
      {secured && <LockIcon />}
      <WifiSignalIcon level={signal} />
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
    <ToggleSwitch checked={checked} onChange={onChange} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export const WiFiSettings = () => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [askToJoin, setAskToJoin] = useState(false);
  const [askToJoinHotspots, setAskToJoinHotspots] = useState(false);

  const connectedNetwork = {
    name: "MERCUSYS_5G",
    secured: true,
    signal: 3,
  };

  const knownNetworks = [
    { id: 1, name: "MERCUSYS_5G", secured: true, signal: 3, connected: true },
    { id: 2, name: "MERCUSYS_B939", secured: true, signal: 2, connected: false },
  ];

  return (
    <SettingsPanel title="Wi-Fi">
      {/* ── MAIN TOGGLE SECTION ── */}
      <SettingsGroup>
        <div className="apple-wifi-header-row">
          <div className="wifi-title-wrapper">
            <div className={`wifi-status-icon-blue ${!wifiEnabled ? "disabled" : ""}`}>
              <img src={wifiIcon} alt="Wi-Fi" />
            </div>
            <span className="apple-label-main">Wi-Fi</span>
          </div>
          <ToggleSwitch checked={wifiEnabled} onChange={() => setWifiEnabled(!wifiEnabled)} />
        </div>

        {wifiEnabled && connectedNetwork && (
          <div className="apple-wifi-connected-card">
            <div className="connected-card-left">
              <span className="apple-status-dot-green" />
              <div className="connected-meta">
                <span className="network-title-bold">{connectedNetwork.name}</span>
                <span className="network-subtitle-status">Connected</span>
              </div>
            </div>
            <div className="connected-card-right">
              <LockIcon />
              <WifiSignalIcon level={connectedNetwork.signal} />
              <button className="apple-btn-secondary">Details…</button>
            </div>
          </div>
        )}
      </SettingsGroup>

      {/* ── PERSONAL HOTSPOTS ── */}
      {wifiEnabled && (
        <>
          <div className="apple-section-header">Personal Hotspots</div>
          <SettingsGroup>
            <NetworkRow
              name="iPhone"
              secured={true}
              signal={3}
              connected={false}
            />
          </SettingsGroup>

          {/* ── KNOWN NETWORKS ── */}
          <div className="apple-section-header">Known Networks</div>
          <SettingsGroup>
            {knownNetworks.map((net) => (
              <NetworkRow
                key={net.id}
                name={net.name}
                secured={net.secured}
                signal={net.signal}
                connected={net.connected}
                onMore={() => console.log("More:", net.name)}
              />
            ))}
          </SettingsGroup>

          {/* ── OTHER NETWORKS ── */}
          <div className="apple-section-header">Other Networks</div>
          <SettingsGroup>
            <div className="apple-other-networks-box">
              <SpinnerIcon />
              <span className="searching-text">Searching…</span>
              <button className="apple-btn-secondary">Other…</button>
            </div>
          </SettingsGroup>

          {/* ── TOGGLE OPTIONS ── */}
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

          {/* ── FOOTER CONTROLS ── */}
          <div className="apple-footer-controls">
            <button className="apple-btn-action-panel">Advanced…</button>
            <button className="apple-btn-help-circle">
              <HelpIcon />
            </button>
          </div>
        </>
      )}
    </SettingsPanel>
  );
};
