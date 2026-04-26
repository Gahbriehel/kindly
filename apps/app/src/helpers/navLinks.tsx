import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export const navLinks = [
  {
    title: "Dashboard",
    icon: <LuLayoutDashboard className="size-5" />,
    href: "/dashboard",
  },
  {
    title: "Clients",
    icon: <MdOutlinePeopleAlt className="size-5" />,
    href: "/clients",
  },
  {
    title: "Templates",
    icon: <IoDocumentTextOutline className="size-5" />,
    href: "/templates",
  },
  {
    title: "Settings",
    icon: <FaCog className="size-5" />,
    href: "/settings  ",
  },
];
