import { useState } from "react";
import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <nav className="flex flex-col bg-gray-100">
      <button
        className="flex justify-center"
        onMouseDown={() => {
          setExpanded(!expanded);
        }}
      >
        <img src="/src/assets/react.svg" className="w-10" />
      </button>

      <ul>
        <SidebarItem label="Stats" expanded={expanded} />
        <SidebarItem label="Users" expanded={expanded} />
      </ul>
    </nav>
  );
}
