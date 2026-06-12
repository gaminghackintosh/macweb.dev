import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const ControlCenterSettings = () => {
  const [wifi, setWifi]           = useState(true);
  const [bt, setBt]               = useState(true);
  const [airdrop, setAirdrop]     = useState(false);
  const [focus, setFocus]         = useState(true);
  const [sound, setSound]         = useState(true);
  const [music, setMusic]         = useState(true);
  const [mirror, setMirror]       = useState(false);
  return (
    <SettingsPanel title="Control Center">
      <SettingsGroup label="Modules">
        <ToggleSwitch label="Wi-Fi"           checked={wifi}    onChange={e => setWifi(e.target.checked)} />
        <ToggleSwitch label="Bluetooth"       checked={bt}      onChange={e => setBt(e.target.checked)} />
        <ToggleSwitch label="AirDrop"         checked={airdrop} onChange={e => setAirdrop(e.target.checked)} />
        <ToggleSwitch label="Focus"           checked={focus}   onChange={e => setFocus(e.target.checked)} />
        <ToggleSwitch label="Sound"           checked={sound}   onChange={e => setSound(e.target.checked)} />
        <ToggleSwitch label="Music"           checked={music}   onChange={e => setMusic(e.target.checked)} />
        <ToggleSwitch label="Screen Mirroring"checked={mirror}  onChange={e => setMirror(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};