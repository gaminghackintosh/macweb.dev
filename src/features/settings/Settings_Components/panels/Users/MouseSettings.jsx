import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const MouseSettings = () => {
  const [speed, setSpeed]             = useState(50);
  const [natural, setNatural]         = useState(true);
  const [secondary, setSecondary]     = useState(true);
  const [acceleration, setAcceleration] = useState(true);
  return (
    <SettingsPanel title="Mouse">
      <SettingsGroup label="Tracking">
        <SettingsRow label="Tracking Speed">
          <input type="range" min="1" max="100" value={speed} onChange={e => setSpeed(e.target.value)} className="ctrl-slider" />
        </SettingsRow>
        <ToggleSwitch label="Mouse Acceleration" checked={acceleration} onChange={e => setAcceleration(e.target.checked)} />
      </SettingsGroup>
      <SettingsGroup label="Scrolling">
        <ToggleSwitch label="Natural Scroll Direction" description="Scroll content in the direction of finger movement" checked={natural}    onChange={e => setNatural(e.target.checked)} />
        <ToggleSwitch label="Secondary Click"                                                                           checked={secondary}  onChange={e => setSecondary(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};