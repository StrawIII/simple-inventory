import { useState } from "react";
import { Sidebar, config } from "../components/Sidebar";
import UserProvider from "../context/User";

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  // const handleToggle = (state: boolean) => setIsExpanded(state);

  const handleToggle = (state: boolean) => true;

  return (
    <UserProvider>
      <div className={""}>
        <Sidebar isExpanded={isExpanded} onChange={handleToggle} />
        <div
          className="relative flex h-full items-center justify-center px-40 "
          style={{
            left: isExpanded ? config.WIDTH_EXPANDED : config.WIDTH,
            width: `calc(100% - ${isExpanded ? config.WIDTH_EXPANDED : config.WIDTH}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </UserProvider>
  );
};
