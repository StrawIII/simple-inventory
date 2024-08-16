import { Link, useLocation } from "react-router-dom";

import LoginIcon from "@mui/icons-material/Login";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import GroupIcon from "@mui/icons-material/Group";
import { useContext } from "react";
import { UserContext } from "../context/User";

export const config = {
  WIDTH: 100,
  WIDTH_EXPANDED: 250,
};

const links = [
  // {
  //     name: "home",
  //     href: "/",
  //     icon: HomeIcon
  // },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ContentPasteIcon,
  },
  {
    name: "Borrows",
    href: "/borrow",
    icon: ChangeCircleIcon,
  },
  {
    name: "Admin",
    href: "/usermanagement",
    icon: GroupIcon,
  },
];

type Props = {
  isExpanded: boolean;
  onChange: (state: boolean) => void;
};

export const Sidebar = ({ isExpanded, onChange }: Props) => {
  const { pathname } = useLocation();
  const { logout } = useContext(UserContext);

  isExpanded = true;

  const renderLinks = links.map((link, index) => {
    const cln =
      pathname === link.href
        ? "bg-primary-light text-white"
        : "hover:bg-gray-300";

    if (isExpanded) {
      return (
        <Link
          key={index}
          className={`flex flex-row items-center gap-[15px] rounded-md px-5 py-2 transition-all ${cln}`}
          to={link.href}
        >
          <link.icon />
          <p className={"font-bold"}>{link.name}</p>
        </Link>
      );
    } else {
      return (
        <Link
          key={index}
          className={`flex w-full cursor-pointer flex-row items-center  justify-center rounded-md py-2 transition-all ${cln}`}
          to={link.href}
        >
          <link.icon />
        </Link>
      );
    }
  });

  return (
    <div
      className={
        "fixed left-0 top-0 h-screen bg-white px-2 py-4 shadow-xl transition-all"
      }
      style={{ width: isExpanded ? config.WIDTH_EXPANDED : config.WIDTH }}
      onMouseEnter={() => onChange(true)}
      onMouseLeave={() => onChange(false)}
    >
      <div className={"flex h-full flex-col items-center justify-between "}>
        {/* APP LOGO */}
        <div className={"w-full"}>
          <p className={"text-center text-xl font-bold"}>Simple Inventory</p>
        </div>

        {/* APP ITEMS (LINKS) */}
        <div className={"flex w-full flex-col gap-[10px]"}>{renderLinks}</div>

        <div
          className={
            "flex w-full cursor-pointer items-center justify-center gap-[15px] rounded-lg bg-red-400 px-5 py-2 transition-all hover:bg-red-500"
          }
          onClick={logout}
        >
          {isExpanded ? (
            <>
              <LoginIcon className={"text-white"} />
              <p className={"flex-1 font-bold text-white"}>Logout</p>
            </>
          ) : (
            <LoginIcon className={"text-white"} />
          )}
        </div>
      </div>
    </div>
  );
};
