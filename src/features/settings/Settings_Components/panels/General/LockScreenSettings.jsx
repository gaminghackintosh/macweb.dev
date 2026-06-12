import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const LockScreenSettings = () => {
  const [datetime, setDatetime]         = useState(true);
  const [battery, setBattery]           = useState(true);
  const [notifications, setNotifs]      = useState(true);
  const [style, setStyle]               = useState("Default");
  return (
    <SettingsPanel title="Lock Screen">
      <SettingsGroup>
        <ToggleSwitch label="Show Date and Time"     checked={datetime}      onChange={e => setDatetime(e.target.checked)} />
        <ToggleSwitch label="Show Battery Status"    checked={battery}       onChange={e => setBattery(e.target.checked)} />
        <ToggleSwitch label="Show Notifications"     checked={notifications} onChange={e => setNotifs(e.target.checked)} />
        <SettingsRow label="Lock Screen Style">
          <select className="ctrl-select" value={style} onChange={e => setStyle(e.target.value)}>
            <option>Default</option><option>Minimal</option>
          </select>
        </SettingsRow>
      </SettingsGroup>
    </SettingsPanel>
  );
};