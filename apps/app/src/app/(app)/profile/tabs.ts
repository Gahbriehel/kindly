import {
  FiUser,
  FiBell,
  FiShield,
  FiFolder,
  FiSun,
  FiZap,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuFileText } from "react-icons/lu";
import type { IconType } from "react-icons";

export type ProfileTab =
  | "profile"
  | "business"
  | "invoices"
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
    id: "invoices",
    name: "Invoices",
    desc: "Numbering & defaults",
    icon: LuFileText,
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
    name: "Categories",
    desc: "Manage your categories",
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
    desc: "Your plan and payments",
    icon: FiZap,
  },
];
