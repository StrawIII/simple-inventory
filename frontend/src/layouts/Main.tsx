import { useState } from "react";
import { Sidebar, config } from "../components/Sidebar";
import UserProvider from "../context/User";

type Props = {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const handleToggle = (state: boolean) => setIsExpanded(state)

    return (
        <UserProvider>
            <div className={""}>
                <Sidebar isExpanded={isExpanded} onChange={handleToggle} />
                <div
                    className="relative px-40 flex items-center justify-center h-full "
                    style={{
                        left: isExpanded ? config.WIDTH_EXPANDED : config.WIDTH,
                        width: `calc(100% - ${isExpanded ? config.WIDTH_EXPANDED : config.WIDTH}px)`,
                    }}
                >
                    {children}
                </div>
            </div>
        </UserProvider>
    )
}
