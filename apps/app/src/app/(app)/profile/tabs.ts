import {
  FiUser,
  FiBell,
  FiShield,
  FiFolder,
  FiSun,
  FiZap,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import type { IconType } from "react-icons";

export type ProfileTab =
  | "profile"
  | "business"
  | "notifications"
  | "security"
  | "categories"
  | "appearance"
  | "billing";

export interface ProfileTabConfig {
  id: ProfileTab;
  name: string;
  desc: string;
  icon: IconType;
}

export const PROFILE_TABS: ProfileTabConfig[] = [
  {
    id: "profile",
    name: "Profile",
    desc: "Your name & photo",
    icon: FiUser,
  },
  {
    id: "business",
    name: "Business",
    desc: "Company & time zone",
    icon: HiOutlineBuildingOffice2,
  },
  {
    id: "notifications",
    name: "Notifications",
    desc: "Alerts & reminders",
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
  {
    id: "billing",
    name: "Plan & Billing",
    desc: "Your plan and invoices",
    icon: FiZap,
  },
];
