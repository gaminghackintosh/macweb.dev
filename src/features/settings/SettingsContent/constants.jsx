// Network Icons
import WiFi_Icon from "@/assets/icons/Settings_menuSections/Network/Wi-Fi.png";
import Bluetooth_Icon from "@/assets/icons/Settings_menuSections/Network/Bluetooth.png";
import Network_Icon from "@/assets/icons/Settings_menuSections/Network/Network.ico";
import Vpn_Icon from "@/assets/icons/Settings_menuSections/Network/VPN.png";

// Other Icons
import Notification_Icon from "@/assets/icons/Settings_menuSections/Second_Part/notifications.png";
import Sounds_Icon from "@/assets/icons/Settings_menuSections/Second_Part/Sounds.webp";
import Focus_Icon from "@/assets/icons/Settings_menuSections/Second_Part/Focus.webp";
import ScreenTime_Icon from "@/assets/icons/Settings_menuSections/Second_Part/Screen_Time.webp";
import GeneralSettings_Icon from "@/assets/icons/apps/Light_Themes/settings_1.png";
import Appearance_Icon from "@/assets/icons/Settings_menuSections/General/Appearance.png";
import Accessibility_Icon from "@/assets/icons/Settings_menuSections/General/Accessibility.png";
import ControlCenter_Icon from "@/assets/icons/Settings_menuSections/General/Control_Center.svg";
import Siri_Icon from "@/assets/icons/Settings_menuSections/General/Siri.webp";
import Security_Icon from "@/assets/icons/Settings_menuSections/General/security_privacy.png";
import DesktopAndDock_Icon from "@/assets/icons/Settings_menuSections/Personalization/DesktopAndDock.png";
import Displays_Icon from "@/assets/icons/Settings_menuSections/Personalization/Displays.png";
import Wallpapers_Icon from "@/assets/icons/Settings_menuSections/Personalization/Wallpapers.png";
import ScreenSaver_Icon from "@/assets/icons/Settings_menuSections/Personalization/ScreenSaver.svg";
import EnergySaver_Icon from "@/assets/icons/Settings_menuSections/Personalization/Energy_Saver.svg";
import LockScreen_Icon from "@/assets/icons/Settings_menuSections/Security/lockScreen.svg";
import LoginPass_Icon from "@/assets/icons/Settings_menuSections/Security/LoginPass.svg";
import Users_Icon from "@/assets/icons/Settings_menuSections/Security/Users.png";
import Pass_Icon from "@/assets/icons/Settings_menuSections/OtherPart/Passwords_dark.png";
import Mail_Icon from "@/assets/icons/Settings_menuSections/OtherPart/mail.png";
import GameCenter_Icon from "@/assets/icons/Settings_menuSections/OtherPart/Game_Center.png";
import Wallet_Icon from "@/assets/icons/Settings_menuSections/OtherPart/Wallet.png";

import { memo } from "react";
import { SettingsPanel } from "@/features/settings/Settings_Components/SettingsPanel";
import {
  AccessibilitySettings, AppearanceSettings, BluetoothSettings, ControlCenterSettings,
  DesktopDockSettings, DisplaysSettings, EnergySaverSettings, FocusSettings,
  GameCenterSettings, GameControllersSettings, GeneralSettings, InternetAccountsSettings,
  LockScreenSettings, LoginPasswordSettings, MouseSettings, NetworkSettings,
  NotificationsSettings, PasswordsSettings, PrivacySettings, SoundSettings,
  UsersSettings, VPNSettings, WiFiSettings,
} from "@/features/settings/Settings_Components/panels";

const UnimplementedPanel = memo(({ title }) => (
  <SettingsPanel title={title}>
    <div className="unimplemented-placeholder">
      <div className="unimplemented-icon">🚧</div>
      <h3>{title}</h3>
      <p>This section is under development.</p>
    </div>
  </SettingsPanel>
));

export const PANELS = {
  wifi: WiFiSettings,
  bluetooth: BluetoothSettings,
  network: NetworkSettings,
  vpn: VPNSettings,
  notifications: NotificationsSettings,
  sound: SoundSettings,
  focus: FocusSettings,
  general: GeneralSettings,
  appearance: AppearanceSettings,
  accessibility: AccessibilitySettings,
  controlcenter: ControlCenterSettings,
  privacy: PrivacySettings,
  desktopdock: DesktopDockSettings,
  displays: DisplaysSettings,
  energysaver: EnergySaverSettings,
  lockscreen: LockScreenSettings,
  loginpassword: LoginPasswordSettings,
  passwords: PasswordsSettings,
  internetaccounts: InternetAccountsSettings,
  gamecenter: GameCenterSettings,
  mouse: MouseSettings,
  gamecontrollers: GameControllersSettings,
  usersgroups: UsersSettings,
  screentime: () => <UnimplementedPanel title="Screen Time" />,
  siri: () => <UnimplementedPanel title="Siri & Spotlight" />,
  wallet: () => <UnimplementedPanel title="Wallet & Apple Pay" />,
  keyboard: () => <UnimplementedPanel title="Keyboard" />,
  printersscanners: () => <UnimplementedPanel title="Printers & Scanners" />,
  screensaver: () => <UnimplementedPanel title="Screen Saver" />,
};

export const MENU_SECTIONS = [
  {
    id: "network",
    items: [
      { id: "wifi", label: "Wi‑Fi", icon: WiFi_Icon, iconType: "image" },
      { id: "bluetooth", label: "Bluetooth", icon: Bluetooth_Icon, iconType: "image" },
      { id: "network", label: "Network", icon: Network_Icon, iconType: "image" },
      { id: "vpn", label: "VPN", icon: Vpn_Icon, iconType: "image" },
    ],
  },
  {
    id: "system",
    items: [
      { id: "notifications", label: "Notifications", icon: Notification_Icon, iconType: "image" },
      { id: "sound", label: "Sound", icon: Sounds_Icon, iconType: "image" },
      { id: "focus", label: "Focus", icon: Focus_Icon, iconType: "image" },
      { id: "screentime", label: "Screen Time", icon: ScreenTime_Icon, iconType: "image" },
    ],
  },
  {
    id: "general",
    items: [
      { id: "general", label: "General", icon: GeneralSettings_Icon, iconType: "image" },
      { id: "appearance", label: "Appearance", icon: Appearance_Icon, iconType: "image" },
      { id: "accessibility", label: "Accessibility", icon: Accessibility_Icon, iconType: "image" },
      { id: "controlcenter", label: "Control Center", icon: ControlCenter_Icon, iconType: "image" },
      { id: "siri", label: "Siri & Spotlight", icon: Siri_Icon, iconType: "image" },
      { id: "privacy", label: "Privacy & Security", icon: Security_Icon, iconType: "image" },
    ],
  },
  {
    id: "desktop",
    items: [
      { id: "desktopdock", label: "Desktop & Dock", icon: DesktopAndDock_Icon, iconType: "image" },
      { id: "displays", label: "Displays", icon: Displays_Icon, iconType: "image" },
      { id: "wallpaper", label: "Wallpaper", icon: Wallpapers_Icon, iconType: "image" },
      { id: "screensaver", label: "Screen Saver", icon: ScreenSaver_Icon, iconType: "image" },
      { id: "energysaver", label: "Energy Saver", icon: EnergySaver_Icon, iconType: "image" },
    ],
  },
  {
    id: "security",
    items: [
      { id: "lockscreen", label: "Lock Screen", icon: LockScreen_Icon, iconType: "image" },
      { id: "loginpassword", label: "Login Password", icon: LoginPass_Icon, iconType: "image" },
      { id: "usersgroups", label: "Users & Groups", icon: Users_Icon, iconType: "image" },
    ],
  },
  {
    id: "accounts",
    items: [
      { id: "passwords", label: "Passwords", icon: Pass_Icon, iconType: "image" },
      { id: "internetaccounts", label: "Internet Accounts", icon: Mail_Icon, iconType: "image" },
      { id: "gamecenter", label: "Game Center", icon: GameCenter_Icon, iconType: "image" },
      { id: "wallet", label: "Wallet & Apple Pay", icon: Wallet_Icon, iconType: "image" },
    ],
  },
  {
    id: "hardware",
    items: [
      { id: "keyboard", label: "Keyboard", icon: "⌨️", iconType: "emoji" },
      { id: "mouse", label: "Mouse", icon: "🖱️", iconType: "emoji" },
      { id: "gamecontrollers", label: "Game Controllers", icon: "🎮", iconType: "emoji" },
      { id: "printersscanners", label: "Printers & Scanners", icon: "🖨️", iconType: "emoji" },
    ],
  },
];
