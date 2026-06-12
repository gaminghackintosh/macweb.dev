import React, { useState } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

export const iCloudSettings = () => {
  const [icloudDrive, setIcloudDrive] = useState(true);
  const [icloudPhotos, setIcloudPhotos] = useState(true);
  const [icloudBackup, setIcloudBackup] = useState(false);
  const [findMyMac, setFindMyMac] = useState(true);
  
  const storageUsed = 12;
  const storageTotal = 50;
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <SettingsPanel title="iCloud">
      {/* Apple ID */}
      <SettingsGroup>
        <div className="apple-id-card">
          <div className="apple-id-avatar-large">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#007AFF">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="apple-id-info-card">
            <span className="apple-id-name">ghost</span>
            <span className="apple-id-email">ghost@icloud.com</span>
          </div>
        </div>
      </SettingsGroup>

      {/* Storage */}
      <SettingsGroup label="Storage">
        <div className="storage-card">
          <div className="storage-bar-container">
            <div className="storage-bar" style={{ width: `${storagePercent}%` }}></div>
          </div>
          <div className="storage-info">
            <span className="storage-used">{storageUsed} GB of {storageTotal} GB used</span>
            <button className="manage-storage-btn">Manage...</button>
          </div>
        </div>
      </SettingsGroup>

      {/* iCloud Services */}
      <SettingsGroup label="Apps Using iCloud">
        <ToggleSwitch 
          label="iCloud Drive" 
          description="Access your files from any device" 
          checked={icloudDrive} 
          onChange={e => setIcloudDrive(e.target.checked)} 
        />
        <ToggleSwitch 
          label="Photos" 
          description="Sync your photos across all devices" 
          checked={icloudPhotos} 
          onChange={e => setIcloudPhotos(e.target.checked)} 
        />
        <ToggleSwitch 
          label="iCloud Backup" 
          description="Automatically backup your Mac" 
          checked={icloudBackup} 
          onChange={e => setIcloudBackup(e.target.checked)} 
        />
        <ToggleSwitch 
          label="Find My Mac" 
          description="Locate your Mac if it's lost or stolen" 
          checked={findMyMac} 
          onChange={e => setFindMyMac(e.target.checked)} 
        />
      </SettingsGroup>

      {/* More Options */}
      <SettingsGroup>
        <SettingsRow label="iCloud Keychain" chevron onClick={() => {}} />
        <SettingsRow label="Mail" chevron onClick={() => {}} />
        <SettingsRow label="Notes" chevron onClick={() => {}} />
        <SettingsRow label="Reminders" chevron onClick={() => {}} />
        <SettingsRow label="Safari" chevron onClick={() => {}} />
      </SettingsGroup>
    </SettingsPanel>
  );
};