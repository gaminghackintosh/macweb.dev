import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const DesktopDockSettings = () => {
  const [autoHide, setAutoHide]       = useState(false);
  const [indicators, setIndicators]   = useState(true);
  const [dockSize, setDockSize]       = useState(50);
  const [position, setPosition]       = useState("Bottom");
  return (
    <SettingsPanel title="Desktop & Dock">
      <SettingsGroup label="Dock">
        <ToggleSwitch label="Automatically Hide and Show the Dock" checked={autoHide}   onChange={e => setAutoHide(e.target.checked)} />
        <ToggleSwitch label="Show Indicators for Open Applications" checked={indicators} onChange={e => setIndicators(e.target.checked)} />
        <SettingsRow label="Size">
          <input type="range" min="1" max="100" value={dockSize} onChange={e => setDockSize(e.target.value)} className="ctrl-slider" />
        </SettingsRow>
        <SettingsRow label="Position on Screen">
          <select className="ctrl-select" value={position} onChange={e => setPosition(e.target.value)}>
            <option>Bottom</option><option>Left</option><option>Right</option>
          </select>
        </SettingsRow>
      </SettingsGroup>
    </SettingsPanel>
  );
};