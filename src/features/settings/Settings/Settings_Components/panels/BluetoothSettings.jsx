import React, { useState } from "react";
import { SettingsPanel, SettingsGroup, SettingsRow, ToggleSwitch } from "../SettingsPanel";
import { SpinnerIcon, DisconnectedIcon, HeadphonesIcon, KeyboardIcon, MouseIcon } from "./../SettingsIcons";
import bluetoothIcon from "./../../../../../assets/icons/Settings_menuSections/Network/Bluetooth.png";

const DEVICE_ICONS = {
  headphones: HeadphonesIcon,
  keyboard: KeyboardIcon,
  mouse: MouseIcon,
};

const DeviceRow = ({ device, onToggle }) => {
  const DeviceIcon = DEVICE_ICONS[device.type] || HeadphonesIcon;
  return (
    <div className="bt-device-row">
      <div className="bt-device-left">
        <span className="bt-device-icon"><DeviceIcon /></span>
        <div className="bt-device-info">
          <span className="bt-device-name">{device.name}</span>
          <span className={`bt-device-status ${device.connected ? "connected" : "disconnected"}`}>
            {device.connected ? "Connected" : "Not Connected"}
          </span>
        </div>
      </div>
      <div className="bt-device-right">
        <button className={`bt-action-btn ${device.connected ? "disconnect" : "connect"}`} onClick={() => onToggle(device.id)}>
          {device.connected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
};

export const BluetoothSettings = () => {
  const [enabled, setEnabled] = useState(true);
  const [showInMenuBar, setShowInMenuBar] = useState(true);
  const [allowHandoff, setAllowHandoff] = useState(true);
  const [devices, setDevices] = useState([
    { id: 1, name: "AirPods Pro", type: "headphones", connected: true },
    { id: 2, name: "Magic Keyboard", type: "keyboard", connected: false },
    { id: 3, name: "Magic Mouse", type: "mouse", connected: false },
  ]);

  const toggleConnection = (id) => setDevices(prev => prev.map(d => d.id === id ? { ...d, connected: !d.connected } : d));

  return (
    <div className="bluetooth-settings-wrapper">
      <SettingsPanel title="Bluetooth" description={enabled ? `Now discoverable as "ghost's MacBook Pro"` : "Bluetooth is Off"}>
        <SettingsGroup>
          <div className="bt-header-row">
            <div className="bt-header-left">
              <div className="bt-icon-circle">
                <img src={bluetoothIcon} alt="Bluetooth" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
              </div>
              <span className="bt-header-label">Bluetooth</span>
            </div>
            <ToggleSwitch checked={enabled} onChange={() => setEnabled(!enabled)} />
          </div>
        </SettingsGroup>

        {enabled && (
          <>
            <SettingsGroup label="My Devices">
              {devices.map(device => <DeviceRow key={device.id} device={device} onToggle={toggleConnection} />)}
            </SettingsGroup>

            <SettingsGroup label="Nearby Devices" footer="Make sure your device is in pairing mode.">
              <div className="bt-scanning-row">
                <div className="spinner-container"><SpinnerIcon /></div>
                <span className="bt-scanning-text">Searching…</span>
              </div>
            </SettingsGroup>

            <SettingsGroup>
              <SettingsRow label="Show Bluetooth in menu bar" rightControl={<ToggleSwitch checked={showInMenuBar} onChange={() => setShowInMenuBar(!showInMenuBar)} />} />
              <SettingsRow
                label="Allow Handoff"
                description="Allow this Mac to automatically discover and use nearby devices for universal clipboard, iPhone calls, and more."
                rightControl={<ToggleSwitch checked={allowHandoff} onChange={() => setAllowHandoff(!allowHandoff)} />}
              />
            </SettingsGroup>

            <div className="bt-advanced-row">
              <button className="bt-advanced-btn">Advanced…</button>
            </div>
          </>
        )}
      </SettingsPanel>
    </div>
  );
};
