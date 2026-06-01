import React, { useState } from "react";
import { SettingsPanel } from "../SettingsPanel";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";
import { ToggleSwitch } from "../ToggleSwitch";

// 👇 Импортируем PNG-иконку Bluetooth (как ты просил)
import bluetoothIcon from "./../../../../../assets/icons/Settings_menuSections/Bluetooth.png";

// Векторные иконки (SVG)
const DisconnectedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 0 1 0 10.72" opacity="0.4"/>
    <path d="M5.64 6.64a9 9 0 0 0 0 10.72" opacity="0.4"/>
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
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

export const BluetoothSettings = () => {
  const [enabled, setEnabled] = useState(true);
  const [showInMenuBar, setShowInMenuBar] = useState(true);
  const [allowHandoff, setAllowHandoff] = useState(true);

  const [myDevices, setMyDevices] = useState([
    { id: 1, name: "AirPods Pro", type: "headphones", connected: true },
    { id: 2, name: "Magic Keyboard", type: "keyboard", connected: false },
    { id: 3, name: "Magic Mouse", type: "mouse", connected: false },
  ]);

  const toggleConnection = (id) => {
    setMyDevices(prev =>
      prev.map(d => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
  };

  return (
    <div className="bluetooth-settings-wrapper">
      <SettingsPanel
        title="Bluetooth"
        description={enabled ? "Now discoverable as “ghost’s MacBook Pro”" : "Bluetooth is Off"}
      >
        {/* Главный переключатель */}
        <SettingsGroup>
          <div className="bt-header-row">
            <div className="bt-header-left">
              <div className="bt-icon-circle">
                <img
                  src={bluetoothIcon}
                  alt="Bluetooth"
                  style={{ width: "40px", height: "40px", objectFit: "contain" }}
                />
              </div>
              <span className="bt-header-label">Bluetooth</span>
            </div>
            <ToggleSwitch checked={enabled} onChange={() => setEnabled(!enabled)} />
          </div>
        </SettingsGroup>

        {enabled && (
          <>
            {/* Мои устройства */}
            <SettingsGroup label="My Devices">
              {myDevices.map(device => (
                <div key={device.id} className="bt-device-row">
                  <div className="bt-device-left">
                    <span className="bt-device-icon">
                      {device.type === "headphones" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                        </svg>
                      )}
                      {device.type === "keyboard" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h8"/>
                        </svg>
                      )}
                      {device.type === "mouse" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="2" width="14" height="20" rx="7"/>
                          <path d="M12 6v4"/>
                        </svg>
                      )}
                    </span>
                    <div className="bt-device-info">
                      <span className="bt-device-name">{device.name}</span>
                      {device.connected ? (
                        <span className="bt-device-status connected">Connected</span>
                      ) : (
                        <span className="bt-device-status disconnected">Not Connected</span>
                      )}
                    </div>
                  </div>
                  <div className="bt-device-right">
                    {device.connected ? (
                      <button
                        className="bt-action-btn disconnect"
                        onClick={() => toggleConnection(device.id)}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        className="bt-action-btn connect"
                        onClick={() => toggleConnection(device.id)}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </SettingsGroup>

            {/* Поиск поблизости */}
            <SettingsGroup label="Nearby Devices" footer="Make sure your device is in pairing mode.">
              <div className="bt-scanning-row">
                <div className="spinner-container">
                  <SpinnerIcon />
                </div>
                <span className="bt-scanning-text">Searching…</span>
              </div>
            </SettingsGroup>

            {/* Опции меню-бара и Handoff */}
            <SettingsGroup>
              <SettingsRow
                label="Show Bluetooth in menu bar"
                rightControl={
                  <ToggleSwitch checked={showInMenuBar} onChange={() => setShowInMenuBar(!showInMenuBar)} />
                }
              />
              <SettingsRow
                label="Allow Handoff"
                description="Allow this Mac to automatically discover and use nearby devices for universal clipboard, iPhone calls, and more."
                rightControl={
                  <ToggleSwitch checked={allowHandoff} onChange={() => setAllowHandoff(!allowHandoff)} />
                }
              />
            </SettingsGroup>

            {/* Advanced */}
            <div className="bt-advanced-row">
              <button className="bt-advanced-btn">Advanced…</button>
            </div>
          </>
        )}
      </SettingsPanel>
    </div>
  );
};