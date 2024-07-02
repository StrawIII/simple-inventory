import { useState, createContext } from "react";
import { SidebarItem } from "./SidebarItem";

const SidebarContext = createContext({ expanded: true })

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <nav className="flex flex-col bg-gray-100 h-screen">
      <SidebarContext.Provider value={{ expanded }}>
        <button
          className="flex justify-center"
          onMouseDown={() => {
            setExpanded(!expanded);
          }}
        >
          <img src="/src/assets/arrow-bar-to-left.svg" className={`w-10 ${expanded ? "rotate-360 transition" : "-rotate-180 transition"}`} />
        </button>
        <ul>
          <SidebarItem label="Stats" icon="/src/assets/alarm.svg" selected={true} />
          <SidebarItem label="Users" icon="/src/assets/alarm.svg" selected={false} />
        </ul>
        <div className="mt-auto">Roman</div>
      </SidebarContext.Provider>
    </nav>
  );
}

export { SidebarContext };
