import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const NetworkSettings = () => {
  const [limitTracking, setLimitTracking] = useState(true);
  const [privateWifi, setPrivateWifi]     = useState(false);
  return (
    <SettingsPanel title="Network">
      <SettingsGroup label="Status">
        <SettingsRow label="Wi-Fi" value="Connected" chevron onClick={() => {}} />
        <SettingsRow label="IP Address" value="192.168.1.42" />
        <SettingsRow label="Router" value="192.168.1.1" />
      </SettingsGroup>
      <SettingsGroup label="Privacy">
        <ToggleSwitch label="Limit IP Address Tracking" description="Hides your IP from known trackers" checked={limitTracking} onChange={e => setLimitTracking(e.target.checked)} />
        <ToggleSwitch label="Use Private Wi-Fi Address" description="Reduces network activity tracking" checked={privateWifi}   onChange={e => setPrivateWifi(e.target.checked)} />
      </SettingsGroup>
      <SettingsGroup>
        <SettingsRow label="DNS Configuration" chevron onClick={() => {}} />
        <SettingsRow label="Proxies"            chevron onClick={() => {}} />
      </SettingsGroup>
    </SettingsPanel>
  );
};