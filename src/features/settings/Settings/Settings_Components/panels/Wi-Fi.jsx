import React, { useState } from "react";
import { SettingsPanel } from "../SettingsPanel";
import { SettingsGroup } from "../SettingsGroup";
import { ToggleSwitch } from "../ToggleSwitch";

// 👇 Импортируем PNG-иконку Wi-Fi (не трогаем)
import wifiIcon from "../../../../../assets/icons/Settings_menuSections/Network/Wi-Fi.png";

// ─── Векторные иконки (SVG) ──────────────────────────────────────
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5-2a1.5 1.5 0 0 1 3 0v2h-3V5z" />
  </svg>
);

const WifiSignalIcon = ({ level = 0, connected = false }) => {
  const bars = [0, 1, 2, 3].map((i) => (
    <rect
      key={i}
      x={i * 4.5}
      y={10 - (i + 1) * 2.5}
      width="3"
      height={(i + 1) * 2.5}
      rx="0.5"
      fill="currentColor"
      opacity={i < level ? 1 : 0.15}
    />
  ));
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      {bars}
    </svg>
  );
};

const CheckmarkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#34c759" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 10l3.5 3.5L15 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
  </svg>
);

export const WiFiSettings = () => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [askToJoin, setAskToJoin] = useState(false);
  const [askToJoinHotspots, setAskToJoinHotspots] = useState(false);

  const knownNetworks = [
    { id: 1, name: "Kernel Panic Network", secured: true, connected: true },
    { id: 2, name: "MERCUSYS_B939", secured: true, connected: false },
  ];

  return (
    <div className="wifi-settings-wrapper">
      <SettingsPanel
        title="Wi‑Fi"
        description={wifiEnabled ? "Wi‑Fi is On" : "Wi‑Fi is Off"}
      >
        {/* ── Основной переключатель ── */}
        <SettingsGroup>
          <div className="wifi-header-row">
            <div className="wifi-header-left">
              <div className="wifi-icon-circle">
                <img
                  src={wifiIcon}
                  alt="Wi-Fi"
                  style={{ width: "24px", height: "24px", objectFit: "contain" }}
                />
              </div>
              <span className="wifi-header-label">Wi‑Fi</span>
            </div>
            <ToggleSwitch checked={wifiEnabled} onChange={() => setWifiEnabled(!wifiEnabled)} />
          </div>

          {wifiEnabled && (
            <div className="connected-status">
              <div className="dot" />
              <span className="status-text">Connected</span>
              <span className="network-name">Kernel Panic Network</span>
            </div>
          )}
        </SettingsGroup>

        {/* ── Personal Hotspots ── */}
        {wifiEnabled && (
          <SettingsGroup label="Personal Hotspots">
            <div className="network-row">
              <div className="network-left">
                <span className="network-name">iPhone</span>
              </div>
              <div className="network-right">
                <LockIcon />
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: 4 }}
                >
                  <path d="M12 2a15 15 0 0 1 0 20" opacity="0.5" />
                  <path d="M12 2a15 15 0 0 0 0 20" />
                </svg>
              </div>
            </div>
          </SettingsGroup>
        )}

        {/* ── Known Networks ── */}
        {wifiEnabled && (
          <SettingsGroup label="Known Networks">
            {knownNetworks.map((network) => (
              <div key={network.id} className="network-row">
                <div className="network-left">
                  {network.connected && <CheckmarkIcon />}
                  <span className="network-name">{network.name}</span>
                </div>
                <div className="network-right">
                  <span className="network-icons">
                    {network.secured && <LockIcon />}
                    <WifiSignalIcon level={network.connected ? 3 : 2} />
                  </span>
                  {network.connected && (
                    <button className="details-btn">Details…</button>
                  )}
                </div>
              </div>
            ))}
          </SettingsGroup>
        )}

        {/* ── Other Networks ── */}
        {wifiEnabled && (
          <SettingsGroup label="Other Networks">
            <div className="other-networks">
              <SpinnerIcon />
              <span className="searching-text">Searching…</span>
              <button className="other-btn">Other…</button>
            </div>
          </SettingsGroup>
        )}

        {/* ── Переключатели ── */}
        {wifiEnabled && (
          <SettingsGroup>
            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">Ask to join networks</span>
                <span className="toggle-desc">
                  Known networks will be joined automatically. If no known networks
                  are available, you will have to manually select a network.
                </span>
              </div>
              <ToggleSwitch checked={askToJoin} onChange={() => setAskToJoin(!askToJoin)} />
            </div>
            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">Ask to join hotspots</span>
                <span className="toggle-desc">
                  Allow this Mac to automatically discover nearby personal hotspots
                  when no Wi‑Fi network is available.
                </span>
              </div>
              <ToggleSwitch checked={askToJoinHotspots} onChange={() => setAskToJoinHotspots(!askToJoinHotspots)} />
            </div>
          </SettingsGroup>
        )}

        {/* ── Advanced кнопка ── */}
        <div className="advanced-row">
          <button className="advanced-btn">Advanced…</button>
        </div>
      </SettingsPanel>
    </div>
  );
};