import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const FocusSettings = () => {
  const [mode, setMode]           = useState("Off");
  const [allowApps, setAllowApps] = useState(false);
  const [shareStatus, setShare]   = useState(false);
  const [autoEnable, setAuto]     = useState(true);
  return (
    <SettingsPanel title="Focus">
      <SettingsGroup>
        <SettingsRow label="Focus Mode">
          <select className="ctrl-select" value={mode} onChange={e => setMode(e.target.value)}>
            <option>Off</option><option>Work</option><option>Personal</option><option>Sleep</option>
          </select>
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup label="Options">
        <ToggleSwitch label="Allow Notifications from Selected Apps" checked={allowApps}    onChange={e => setAllowApps(e.target.checked)} />
        <ToggleSwitch label="Share Focus Status"                     checked={shareStatus}  onChange={e => setShare(e.target.checked)} />
        <ToggleSwitch label="Turn On Automatically"                  checked={autoEnable}   onChange={e => setAuto(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};