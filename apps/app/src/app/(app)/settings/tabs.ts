import { FiBell, FiShield, FiFolder, FiSun } from "react-icons/fi";
import type { IconType } from "react-icons";

export type SettingsTab =
  | "notifications"
  | "security"
  | "categories"
  | "appearance";

export interface SettingsTabConfig {
  id: SettingsTab;
  name: string;
  desc: string;
  icon: IconType;
}

export const SETTINGS_TABS: SettingsTabConfig[] = [
  {
    id: "notifications",
    name: "Notifications",
    desc: "Alerts & updates preferences",
    icon: FiBell,
  },
  {
    id: "security",
    name: "Security & Login",
    desc: "Password & 2FA settings",
    icon: FiShield,
  },
  {
    id: "categories",
    name: "Template Categories",
    desc: "Manage custom categories",
    icon: FiFolder,
  },
  {
    id: "appearance",
    name: "Appearance",
    desc: "Theme & visual preferences",
    icon: FiSun,
  },
];
