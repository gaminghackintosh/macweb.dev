import React, { useState } from "react";
import { SettingsPanel } from "./../../SettingsPanel";
import { SettingsGroup } from "./../../SettingsGroup";
import { SettingsRow } from "./../../SettingsPanel";
import { ToggleSwitch } from "./../../ToggleSwitch";

import { SpinnerIcon } from "../../SettingsIcons";
import bluetoothIcon from "./../../../../../assets/icons/Settings_menuSections/Network/Bluetooth.png";

// ═══════════════════════════════════════════════════════════════════
//  Device Icons
// ═══════════════════════════════════════════════════════════════════

const HeadphonesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const KeyboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h8" />
  </svg>
);

const MouseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="7" />
    <path d="M12 6v4" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
);

const DEVICE_ICONS = {
  headphones: HeadphonesIcon,
  keyboard: KeyboardIcon,
  mouse: MouseIcon,
};

// ═══════════════════════════════════════════════════════════════════
//  Device Row Component
// ═══════════════════════════════════════════════════════════════════

const DeviceRow = ({ device, onInfo }) => {
  const DeviceIcon = DEVICE_ICONS[device.type] || HeadphonesIcon;
  return (
    <div className="bt-device-row">
      <div className="bt-device-left">
        <span className="bt-device-icon">
          <DeviceIcon />
        </span>
        <div className="bt-device-info">
          <span className="bt-device-name">{device.name}</span>
          <span className="bt-device-status">{device.connected ? "Connected" : "Not Connected"}</span>
        </div>
      </div>
      <div className="bt-device-right">
        <button className="bt-info-btn" onClick={() => onInfo(device)} aria-label="Info">
          <InfoIcon />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export const BluetoothSettings = () => {
  const [enabled, setEnabled] = useState(true);
  const [devices] = useState([
    { id: 1, name: "AirPods Pro", type: "headphones", connected: false },
    { id: 2, name: "UGREEN KB 3.0", type: "keyboard", connected: true },
  ]);

  return (
    <SettingsPanel title="Bluetooth">
      <div className="bluetooth-settings-wrapper">
        {/* ── HEADER CARD ── */}
        <SettingsGroup>
          <div className="bt-header-card">
            <div className="bt-header-left">
              <div className="bt-icon-square">
                <img src={bluetoothIcon} alt="Bluetooth" />
              </div>
              <div className="bt-header-text">
                <span className="bt-header-title">Bluetooth</span>
                <span className="bt-header-desc">
                  This Mac is discoverable as "Mac mini" while Bluetooth Settings is open.
                </span>
              </div>
            </div>
            <ToggleSwitch checked={enabled} onChange={() => setEnabled(!enabled)} />
          </div>
        </SettingsGroup>

        {/* ── MY DEVICES ── */}
        {enabled && (
          <>
            <div className="bt-section-header">My Devices</div>
            <SettingsGroup>
              {devices.map(device => (
                <DeviceRow key={device.id} device={device} onInfo={(d) => console.log("Info:", d.name)} />
              ))}
            </SettingsGroup>

            {/* ── HELP BUTTON ── */}
            <div className="bt-help-row">
              <button className="bt-help-btn" aria-label="Help">
                <HelpIcon />
              </button>
            </div>

            {/* ── NEARBY DEVICES ── */}
            <div className="bt-section-header">Nearby Devices</div>
            <SettingsGroup>
              <div className="bt-searching-row">
                <div className="bt-searching-icon">
                  <SpinnerIcon />
                </div>
                <span className="bt-searching-text">Searching…</span>
              </div>
            </SettingsGroup>
          </>
        )}
      </div>
    </SettingsPanel>
  );
};
