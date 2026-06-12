import React, { useState } from "react";
import { SettingsPanel } from "./../../SettingsPanel";
import { SettingsGroup } from "./../../SettingsGroup";
import { SettingsRow } from "./../../SettingsPanel";
import { ToggleSwitch } from "./../../ToggleSwitch";

export const InternetAccountsSettings = () => {
  const [contacts, setContacts]   = useState(true);
  const [calendars, setCalendars] = useState(true);
  const [mail, setMail]           = useState(true);
  return (
    <SettingsPanel title="Internet Accounts">
      <SettingsGroup label="Accounts">
        <SettingsRow label="iCloud"  value="Signed In" chevron onClick={() => {}} />
        <SettingsRow label="Google"  chevron onClick={() => {}}>
          <span className="sr-badge sr-badge--blue">Add Account</span>
        </SettingsRow>
      </SettingsGroup>
      <SettingsGroup label="Sync">
        <ToggleSwitch label="Contacts"  checked={contacts}  onChange={e => setContacts(e.target.checked)} />
        <ToggleSwitch label="Calendars" checked={calendars} onChange={e => setCalendars(e.target.checked)} />
        <ToggleSwitch label="Mail"      checked={mail}      onChange={e => setMail(e.target.checked)} />
      </SettingsGroup>
    </SettingsPanel>
  );
};