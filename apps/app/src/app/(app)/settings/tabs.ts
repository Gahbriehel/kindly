import { FiBell, FiShield, FiFolder } from "react-icons/fi";
import type { IconType } from "react-icons";

export type SettingsTab = "notifications" | "security" | "categories";

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
];
