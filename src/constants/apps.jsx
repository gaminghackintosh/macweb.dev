import {
  APP_ICONS,
  APP_ICON_FALLBACK,
} from "../assets/paths";

export const APPS = [
  {
    id: "finder",
    name: "Finder",
    iconPath: APP_ICONS.finder,
    icon: APP_ICON_FALLBACK.finder,
  },
  {
    id: "safari",
    name: "Safari",
    iconPath: APP_ICONS.safari,
    icon: APP_ICON_FALLBACK.safari,
    color: "#ffffff",
  },
  {
    id: "notes",
    name: "Notes",
    iconPath: APP_ICONS.notes,
    icon: APP_ICON_FALLBACK.notes,
    color: "#FFD60A",
  },
  {
    id: "terminal",
    name: "Terminal",
    iconPath: APP_ICONS.terminal,
    icon: APP_ICON_FALLBACK.terminal,
    color: "#1C1C1E",
  },
  {
    id: "music",
    name: "Music",
    iconPath: APP_ICONS.music,
    icon: APP_ICON_FALLBACK.music,
    color: "#FF375F",
  },
  {
    id: "settings",
    name: "System Settings",
    iconPath: APP_ICONS.settings,
    icon: APP_ICON_FALLBACK.settings,
    color: "#636366",
  },
];