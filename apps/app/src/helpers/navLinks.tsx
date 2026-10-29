import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbUserScreen } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { PiCalendarBlankLight } from "react-icons/pi";
import { FaRegFile } from "react-icons/fa";
import type { IUserData, UserRole } from "../models/auth";
import type { Permission } from "../models/permission";
import { hasPermission } from "./permissions";

export interface NavLink {
  title: string;
  icon: React.ReactNode;
  href: string;
  roles: UserRole[];
  /** Staff also need this permission to see the link. */
  permission?: Permission;
}

export const navLinks: NavLink[] = [
  {
    title: "Dashboard",
    icon: <LuLayoutDashboard className="size-5" />,
    href: "/dashboard",
    roles: ["OWNER", "STAFF"],
    permission: "DASHBOARD_VIEW",
  },
  {
    title: "Clients",
    icon: <MdOutlinePeopleAlt className="size-5" />,
    href: "/clients",
    roles: ["OWNER", "STAFF"],
    permission: "CLIENT_VIEW",
  },
  {
    title: "Calendar",
    icon: <PiCalendarBlankLight className="size-5" />,
    href: "/calendar",
    roles: ["OWNER", "STAFF"],
    permission: "EVENT_VIEW",
  },
  {
    title: "Templates",
    icon: <IoDocumentTextOutline className="size-5" />,
    href: "/templates",
    roles: ["OWNER", "STAFF"],
    permission: "TEMPLATE_VIEW",
  },
  {
    title: "Invoices",
    icon: <FaRegFile className="size-5" />,
    href: "/invoices",
    roles: ["OWNER", "STAFF"],
    permission: "INVOICE_VIEW",
  },
  {
    title: "Staff",
    icon: <TbUserScreen className="size-5" />,
    href: "/staff",
    roles: ["OWNER"],
  },
  {
    title: "Profile",
    icon: <CgProfile className="size-5" />,
    href: "/profile",
    roles: ["OWNER", "STAFF"],
  },
];

type NavUser = Pick<IUserData, "role" | "permissions"> | null | undefined;

const canSee = (link: NavLink, user: NavUser) =>
  link.roles.includes(user?.role ?? "STAFF") &&
  (!link.permission || hasPermission(user, link.permission));

// Falls back to the least-privileged role until the user is loaded.
export const getNavLinks = (user: NavUser) =>
  navLinks.filter((link) => canSee(link, user));

/**
 * Where `user` should go instead of `pathname`, or null if they may stay.
 * Paths without a nav link (e.g. nested routes) are left to the page.
 */
export function getRedirectFor(pathname: string, user: NavUser) {
  const link = navLinks.find(
    (l) => pathname === l.href || pathname.startsWith(`${l.href}/`),
  );
  if (!link || canSee(link, user)) return null;
  return getNavLinks(user)[0]?.href ?? "/profile";
}
