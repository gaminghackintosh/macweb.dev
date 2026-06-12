import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const GameCenterSettings = () => {
  const [multiplayer, setMultiplayer] = useState(true);
  const [notifs, setNotifs]           = useState(true);
  return (
    <SettingsPanel title="Game Center">
      <SettingsGroup label="Account">
        <SettingsRow label="Status"   value="Signed In" />
        <SettingsRow label="Nickname" value="ghost" chevron onClick={() => {}} />
      </SettingsGroup>
      <SettingsGroup label="Options">
        <ToggleSwitch label="Show in Multiplayer Games" checked={multiplayer} onChange={e => setMultiplayer(e.target.checked)} />
        <ToggleSwitch label="Enable Notifications"      checked={notifs}      onChange={e => setNotifs(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};