import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbUserScreen } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { PiCalendarBlankLight } from "react-icons/pi";
import { FaRegFile } from "react-icons/fa";
import type { UserRole } from "../models/auth";

export interface NavLink {
  title: string;
  icon: React.ReactNode;
  href: string;
  roles: UserRole[];
}

export const navLinks: NavLink[] = [
  {
    title: "Dashboard",
    icon: <LuLayoutDashboard className="size-5" />,
    href: "/dashboard",
    roles: ["admin", "moderator"],
  },
  {
    title: "Clients",
    icon: <MdOutlinePeopleAlt className="size-5" />,
    href: "/clients",
    roles: ["admin", "moderator"],
  },
  {
    title: "Calendar",
    icon: <PiCalendarBlankLight className="size-5" />,
    href: "/calendar",
    roles: ["admin", "moderator"],
  },
  {
    title: "Templates",
    icon: <IoDocumentTextOutline className="size-5" />,
    href: "/templates",
    roles: ["admin", "moderator"],
  },
  {
    title: "Invoices",
    icon: <FaRegFile className="size-5" />,
    href: "/invoices",
    roles: ["admin", "moderator"],
  },
  {
    title: "Staff",
    icon: <TbUserScreen className="size-5" />,
    href: "/staff",
    roles: ["admin"],
  },
  {
    title: "Profile",
    icon: <CgProfile className="size-5" />,
    href: "/profile",
    roles: ["admin", "moderator"],
  },
];

export const getNavLinks = (role: UserRole) => {
  const filtered = navLinks.filter((link) => link.roles.includes(role));
  return filtered.length > 0 ? filtered : navLinks;
};
