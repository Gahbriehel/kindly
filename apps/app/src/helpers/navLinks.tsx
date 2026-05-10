import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbUserScreen } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
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
    roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"],
  },
  {
    title: "Clients",
    icon: <MdOutlinePeopleAlt className="size-5" />,
    href: "/clients",
    roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"],
  },
  {
    title: "Templates",
    icon: <IoDocumentTextOutline className="size-5" />,
    href: "/templates",
    roles: ["ROLE_USER", "ROLE_ADMIN"],
  },
  {
    title: "Settings",
    icon: <FaCog className="size-5" />,
    href: "/settings",
    roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"],
  },
  {
    title: "Profile",
    icon: <CgProfile className="size-5" />,
    href: "/profile",
    roles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"],
  },
  {
    title: "Staff",
    icon: <TbUserScreen className="size-5" />,
    href: "/staff",
    roles: ["ROLE_ADMIN", "ROLE_USER"],
  },
];

export const getNavLinks = (role: UserRole) => {
  const filtered = navLinks.filter((link) => link.roles.includes(role));
  // Fall back to all links if the role doesn't match any known value
  // (e.g. API returns a different role format than expected)
  return filtered.length > 0 ? filtered : navLinks;
};
