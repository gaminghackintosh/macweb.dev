import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const LoginPasswordSettings = () => {
  const [autoLogin, setAutoLogin]   = useState(false);
  const [touchId, setTouchId]       = useState(true);
  const [requirePw, setRequirePw]   = useState(true);
  return (
    <SettingsPanel title="Login Password">
      <SettingsGroup>
        <SettingsRow label="Change Password" chevron onClick={() => {}} />
      </SettingsGroup>
      <SettingsGroup label="Login Options">
        <ToggleSwitch label="Automatic Login"           description="Log in automatically on startup"        checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)} />
        <ToggleSwitch label="Use Touch ID"              description="Use fingerprint to unlock your Mac"     checked={touchId}   onChange={e => setTouchId(e.target.checked)} />
        <ToggleSwitch label="Require Password After Sleep" checked={requirePw} onChange={e => setRequirePw(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};