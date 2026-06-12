import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const AccessibilitySettings = () => {
  const [voiceOver, setVoiceOver]         = useState(false);
  const [zoom, setZoom]                   = useState(false);
  const [contrast, setContrast]           = useState(false);
  const [reduceMotion, setReduceMotion]   = useState(true);
  const [stickyKeys, setStickyKeys]       = useState(false);

  return (
    <SettingsPanel title="Accessibility">
      <SettingsGroup label="Vision">
        <ToggleSwitch label="VoiceOver"        description="Use spoken descriptions of interface elements" checked={voiceOver}     onChange={e => setVoiceOver(e.target.checked)} />
        <ToggleSwitch label="Zoom"             description="Use keyboard shortcuts or scroll gestures to zoom" checked={zoom}      onChange={e => setZoom(e.target.checked)} />
        <ToggleSwitch label="Increase Contrast"description="Increase contrast for better visibility"           checked={contrast}  onChange={e => setContrast(e.target.checked)} />
      </SettingsGroup>
      <SettingsGroup label="Motor">
        <ToggleSwitch label="Reduce Motion"    description="Limit motion effects throughout the system" checked={reduceMotion} onChange={e => setReduceMotion(e.target.checked)} />
        <ToggleSwitch label="Sticky Keys"      description="Press modifier keys one at a time"          checked={stickyKeys}   onChange={e => setStickyKeys(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};