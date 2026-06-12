import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const VPNSettings = () => {
  const [vpn, setVpn] = useState(false);
  return (
    <SettingsPanel title="VPN">
      <SettingsGroup>
        <ToggleSwitch label="VPN" description={vpn ? "Connected" : "Disconnected"} checked={vpn} onChange={e => setVpn(e.target.checked)} />
      </SettingsGroup>
      <SettingsGroup label="Configuration">
        <SettingsRow label="Server"     value="Not configured" />
        <SettingsRow label="Encryption" value="AES-256" />
        <SettingsRow label="Configure VPN" chevron onClick={() => {}} />
      </SettingsGroup>
    </SettingsPanel>
  );
};