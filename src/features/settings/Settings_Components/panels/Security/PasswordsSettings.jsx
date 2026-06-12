import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const PasswordsSettings = () => {
  const [autoFill, setAutoFill]       = useState(true);
  const [faceId, setFaceId]           = useState(false);
  const [strong, setStrong]           = useState(true);
  const [monitor, setMonitor]         = useState(true);
  return (
    <SettingsPanel title="Passwords">
      <SettingsGroup>
        <SettingsRow label="Saved Passwords" chevron onClick={() => {}}>
          <span className="sr-badge sr-badge--gray">View All</span>
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup label="AutoFill & Security">
        <ToggleSwitch label="AutoFill Passwords"          checked={autoFill} onChange={e => setAutoFill(e.target.checked)} />
        <ToggleSwitch label="Use Face ID for Passwords"   checked={faceId}   onChange={e => setFaceId(e.target.checked)} />
        <ToggleSwitch label="Generate Strong Passwords"   checked={strong}   onChange={e => setStrong(e.target.checked)} />
        <ToggleSwitch label="Detect Leaked Passwords"     description="Notifies you if your passwords appear in data leaks" checked={monitor} onChange={e => setMonitor(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};