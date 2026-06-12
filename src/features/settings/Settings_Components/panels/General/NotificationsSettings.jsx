import React, { useState, memo, useCallback } from "react";
import { SettingsPanel } from "../../SettingsPanel";
import { SettingsGroup } from "../../SettingsPanel";
import { SettingsRow } from "../../SettingsPanel";
import { ToggleSwitch } from "../../SettingsPanel";

// Иконки приложений
const AppIcons = {
  Messages: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#34C759"/>
      <path d="M8 10h16v10l-4 4H8V10z" fill="white"/>
    </svg>
  ),
  Mail: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#007AFF"/>
      <path d="M6 10l10 7 10-7v12H6V10z" fill="white"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#FF3B30"/>
      <rect x="6" y="10" width="20" height="16" rx="2" fill="white"/>
      <text x="16" y="22" textAnchor="middle" fill="#FF3B30" fontSize="10" fontWeight="700">15</text>
    </svg>
  ),
  Reminders: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#FF9500"/>
      <circle cx="12" cy="14" r="3" fill="white"/>
      <circle cx="20" cy="14" r="3" fill="white" opacity="0.6"/>
      <circle cx="12" cy="22" r="3" fill="white" opacity="0.6"/>
      <circle cx="20" cy="22" r="3" fill="white" opacity="0.4"/>
    </svg>
  ),
  Photos: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="white"/>
      <circle cx="16" cy="16" r="10" fill="url(#photosGrad)"/>
      <defs>
        <linearGradient id="photosGrad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#FF9500"/>
          <stop offset="50%" stopColor="#FF2D55"/>
          <stop offset="100%" stopColor="#AF52DE"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  Safari: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#007AFF"/>
      <path d="M16 4l2 8 6 4-6 4-2 8-2-8-6-4 6-4 2-8z" fill="white"/>
    </svg>
  ),
  Maps: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#34C759"/>
      <path d="M10 8l6-2 6 2 4-2v18l-4 2-6-2-6 2-4-2V6l4 2z" fill="white" opacity="0.9"/>
      <path d="M16 6v20" stroke="#FF3B30" strokeWidth="2"/>
      <circle cx="16" cy="14" r="3" fill="#FF3B30"/>
    </svg>
  ),
  FaceTime: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#34C759"/>
      <rect x="6" y="10" width="16" height="12" rx="2" fill="white"/>
      <path d="M22 14l4-2v8l-4-2v-4z" fill="white"/>
    </svg>
  ),
  Music: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#FF2D55"/>
      <path d="M10 20a4 4 0 1 0 4-4V8l10-2v12" stroke="white" strokeWidth="2.5" fill="none"/>
    </svg>
  ),
  Terminal: () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#1C1C1E"/>
      <path d="M10 16l4 4-4 4M16 24h6" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
};

const APPS_NOTIFICATIONS = [
  { id: "messages", name: "Messages", icon: AppIcons.Messages, style: "banners", sound: true, badge: true, lockScreen: true },
  { id: "mail", name: "Mail", icon: AppIcons.Mail, style: "banners", sound: true, badge: true, lockScreen: true },
  { id: "calendar", name: "Calendar", icon: AppIcons.Calendar, style: "alerts", sound: false, badge: true, lockScreen: true },
  { id: "reminders", name: "Reminders", icon: AppIcons.Reminders, style: "alerts", sound: false, badge: true, lockScreen: false },
  { id: "photos", name: "Photos", icon: AppIcons.Photos, style: "none", sound: false, badge: false, lockScreen: false },
  { id: "safari", name: "Safari", icon: AppIcons.Safari, style: "banners", sound: false, badge: false, lockScreen: true },
  { id: "maps", name: "Maps", icon: AppIcons.Maps, style: "banners", sound: true, badge: false, lockScreen: true },
  { id: "facetime", name: "FaceTime", icon: AppIcons.FaceTime, style: "banners", sound: true, badge: true, lockScreen: true },
  { id: "music", name: "Music", icon: AppIcons.Music, style: "none", sound: false, badge: false, lockScreen: false },
  { id: "terminal", name: "Terminal", icon: AppIcons.Terminal, style: "banners", sound: false, badge: false, lockScreen: false },
];

const NotificationRow = memo(({ app, onToggle }) => {
  const IconComponent = app.icon;
  return (
    <div className="notification-app-row">
      <div className="notification-app-left">
        <div className="notification-app-icon">
          <IconComponent />
        </div>
        <span className="notification-app-name">{app.name}</span>
      </div>
      <div className="notification-app-right">
        <select 
          className="ctrl-select notification-style-select"
          value={app.style}
          onChange={(e) => onToggle(app.id, e.target.value)}
        >
          <option value="banners">Banners</option>
          <option value="alerts">Alerts</option>
          <option value="none">None</option>
        </select>
      </div>
    </div>
  );
});

export const NotificationsSettings = memo(function NotificationsSettings() {
  const [masterToggle, setMasterToggle] = useState(true);
  const [showInLockScreen, setShowInLockScreen] = useState(true);
  const [showInHistory, setShowInHistory] = useState(true);
  const [showPreviews, setShowPreviews] = useState(true);
  const [apps, setApps] = useState(APPS_NOTIFICATIONS);

  const handleAppToggle = useCallback((appId, value) => {
    setApps(prev => prev.map(app => 
      app.id === appId 
        ? { ...app, style: value }
        : app
    ));
  }, []);

  return (
    <SettingsPanel title="Notifications" description="Manage notification preferences for your apps">
      <SettingsGroup>
        <div className="notifications-master-row">
          <div className="notifications-master-left">
            <span className="notifications-master-label">Allow Notifications</span>
          </div>
          <ToggleSwitch checked={masterToggle} onChange={() => setMasterToggle(!masterToggle)} />
        </div>
        
        {masterToggle && (
          <>
            <ToggleSwitch
              label="Show in Lock Screen"
              checked={showInLockScreen}
              onChange={() => setShowInLockScreen(!showInLockScreen)}
            />
            <ToggleSwitch
              label="Show in Notification History"
              checked={showInHistory}
              onChange={() => setShowInHistory(!showInHistory)}
            />
            <ToggleSwitch
              label="Show Previews"
              description="Show message content in notifications"
              checked={showPreviews}
              onChange={() => setShowPreviews(!showPreviews)}
            />
          </>
        )}
      </SettingsGroup>

      {masterToggle && (
        <SettingsGroup label="Notification Style">
          <div className="notifications-apps-list">
            {apps.map(app => (
              <NotificationRow key={app.id} app={app} onToggle={handleAppToggle} />
            ))}
          </div>
        </SettingsGroup>
      )}
    </SettingsPanel>
  );
});