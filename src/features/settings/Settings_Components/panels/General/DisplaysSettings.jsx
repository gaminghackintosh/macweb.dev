import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const DisplaysSettings = () => {
  const [resolution, setResolution]   = useState("Default");
  const [refresh, setRefresh]         = useState("60 Hz");
  const [nightShift, setNightShift]   = useState(false);
  const [trueTone, setTrueTone]       = useState(true);
  return (
    <SettingsPanel title="Displays">
      <SettingsGroup label="Built-in Display">
        <SettingsRow label="Resolution">
          <select className="ctrl-select" value={resolution} onChange={e => setResolution(e.target.value)}>
            <option>Default</option><option>1920 × 1080</option><option>2560 × 1440</option><option>3840 × 2160</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Refresh Rate">
          <select className="ctrl-select" value={refresh} onChange={e => setRefresh(e.target.value)}>
            <option>60 Hz</option><option>120 Hz</option>
          </select>
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup label="Colour">
        <ToggleSwitch label="True Tone"    description="Automatically adapt the display to ambient light" checked={trueTone}   onChange={e => setTrueTone(e.target.checked)} />
        <ToggleSwitch label="Night Shift"  description="Shift display colors warmer after sunset"         checked={nightShift} onChange={e => setNightShift(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};