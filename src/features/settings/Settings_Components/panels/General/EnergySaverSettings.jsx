import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const EnergySaverSettings = () => {
  const [lowPower, setLowPower]           = useState(false);
  const [videoStream, setVideoStream]     = useState(true);
  const [displaySleep, setDisplaySleep]   = useState("5 minutes");
  const [systemSleep, setSystemSleep]     = useState("10 minutes");
  return (
    <SettingsPanel title="Energy Saver">
      <SettingsGroup label="Battery">
        <ToggleSwitch label="Low Power Mode"                description="Reduces system performance to save battery" checked={lowPower}    onChange={e => setLowPower(e.target.checked)} />
        <ToggleSwitch label="Optimise Video Streaming"      checked={videoStream}  onChange={e => setVideoStream(e.target.checked)} />
        <SettingsRow label="Turn Display Off After">
          <select className="ctrl-select" value={displaySleep} onChange={e => setDisplaySleep(e.target.value)}>
            <option>2 minutes</option><option>5 minutes</option><option>10 minutes</option><option>Never</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Put Hard Disks to Sleep When Possible">
          <select className="ctrl-select" value={systemSleep} onChange={e => setSystemSleep(e.target.value)}>
            <option>10 minutes</option><option>20 minutes</option><option>Never</option>
          </select>
        </SettingsRow>
      </SettingsGroup>
    </SettingsPanel>
  );
};