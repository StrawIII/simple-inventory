import { Link, useLocation } from "react-router-dom"

import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import GroupIcon from '@mui/icons-material/Group';
import { useContext } from "react";
import { UserContext } from "../context/User";

export const config = {
    WIDTH: 100,
    WIDTH_EXPANDED: 250
}

const links = [
    // {
    //     name: "home",
    //     href: "/",
    //     icon: HomeIcon
    // },
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: ContentPasteIcon
    },
    {
        name: 'Borrows',
        href: '/borrow',
        icon: ChangeCircleIcon
    },
    {
        name: "Admin",
        href: '/usermanagement',
        icon: GroupIcon
    }
]

type Props = {
    isExpanded: boolean
    onChange: (state: boolean) => void
}

export const Sidebar = ({ isExpanded, onChange }: Props) => {
    const { pathname } = useLocation()
    const { logout } = useContext(UserContext)

    const renderLinks = links.map((link, index) => {

        const cln = pathname === link.href ? "bg-primary-light text-white" : "hover:bg-gray-300"

        if (isExpanded) {
            return <Link key={index} className={`flex flex-row items-center px-5 py-2 rounded-md transition-all gap-[15px] ${cln}`} to={link.href}>
                <link.icon />
                <p className={"font-bold"}>{link.name}</p>
            </Link>
        } else {
            return <Link key={index} className={`flex flex-row items-center justify-center w-full  py-2 rounded-md transition-all cursor-pointer ${cln}`} to={link.href}>
                <link.icon />
            </Link>
        }
    })

    return (
        <div className={'fixed left-0 top-0 h-screen transition-all bg-white shadow-xl px-2 py-4'} style={{ width: isExpanded ? config.WIDTH_EXPANDED : config.WIDTH }}
            onMouseEnter={() => onChange(true)}
            onMouseLeave={() => onChange(false)}>
            <div className={"flex flex-col items-center justify-between h-full"}>
                {/* APP LOGO */}
                <div className={"w-full"}>
                    <p className={'font-bold text-xl text-center'}>Simple Inventory</p>
                </div>

                {/* APP ITEMS (LINKS) */}
                <div className={'flex flex-col gap-[10px] w-full'}>
                    {renderLinks}
                </div>

                <div className={"w-full px-5 rounded-lg gap-[15px] bg-red-400 flex items-center justify-center py-2 cursor-pointer hover:bg-red-500 transition-all"} onClick={logout}>
                    {isExpanded ? (
                        <>
                            <LoginIcon className={"text-white"} />
                            <p className={"text-white font-bold flex-1"}>Logout</p>
                        </>
                    ) : (
                        <LoginIcon className={"text-white"} />

                    )}
                </div>
            </div>
        </div>
    )
}
