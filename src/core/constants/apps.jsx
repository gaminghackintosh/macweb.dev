import {
  APP_ICONS,
  APP_ICONS_LIGHT,
  APP_ICON_FALLBACK,
} from "@/assets/paths";

export const INITIAL_POSITIONS = {
  finder: { x: 80, y: 56, w: 940, h: 560 }, 
  safari: { x: 100, y: 70, w: 900, h: 650 },
  notes: { x: 120, y: 90, w: 850, h: 550 },  
  terminal: { x: 140, y: 110, w: 700, h: 450 }, 
  music: { x: 160, y: 130, w: 1000, h: 500 },
  settings: { x: 180, y: 150, w: 700, h: 450 },
  calendar: { x: 200, y: 120, w: 900, h: 580 },
  calculator: { x: 500, y: 150 },
};

export const APPS = [
  {
    id: "finder",
    name: "Finder",
    iconPath: APP_ICONS.finder,
    iconPathLight: APP_ICONS_LIGHT.finder,
    icon: APP_ICON_FALLBACK.finder,
  },
  {
    id: "safari",
    name: "Safari",
    iconPath: APP_ICONS.safari,
    iconPathLight: APP_ICONS_LIGHT.safari,
    icon: APP_ICON_FALLBACK.safari,
    color: "#ffffff",
  },
  {
    id: "notes",
    name: "Notes",
    iconPath: APP_ICONS.notes,
    iconPathLight: APP_ICONS_LIGHT.notes,
    icon: APP_ICON_FALLBACK.notes,
    color: "#FFD60A",
  },
  {
    id: "terminal",
    name: "Terminal",
    iconPath: APP_ICONS.terminal,
    iconPathLight: APP_ICONS_LIGHT.terminal,
    icon: APP_ICON_FALLBACK.terminal,
    color: "#1C1C1E",
  },
  {
    id: "music",
    name: "Music",
    iconPath: APP_ICONS.music,
    iconPathLight: APP_ICONS_LIGHT.music,
    icon: APP_ICON_FALLBACK.music,
    color: "#FF375F",
  },
  {
    id: "settings",
    name: "Settings",
    iconPath: APP_ICONS.settings,
    iconPathLight: APP_ICONS_LIGHT.settings,
    icon: APP_ICON_FALLBACK.settings,
    color: "#636366",
  },
  {
    id: "calendar",
    name: "Calendar",
    iconPath: APP_ICONS.calendar,
    iconPathLight: APP_ICONS_LIGHT.calendar,
    icon: APP_ICON_FALLBACK.calendar,
    color: "#FF3B30",
  },
  {
    id: "calculator",
    name: "Calculator",
    iconPath: APP_ICONS.calculator,
    iconPathLight: APP_ICONS_LIGHT.calculator,
    icon: APP_ICON_FALLBACK.calculator,
    color: "#FF9500",
  },
];