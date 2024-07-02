import { useContext } from "react";
import { SidebarContext } from "./Sidebar";

export type SidebarItemProps = {
  label: string;
  icon: string;
  selected: boolean;
};

export function SidebarItem({ label, icon, selected }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext)
  return (
    <div className={`m-5 flex rounded-xl  px-3 py-3 hover:bg-primary-light ${selected ? "bg-primary-dark" : "bg-red-300"}`}>
      <img src={icon} />
      <div className={`${expanded ? "" : "hidden"} px-10`}>{label}</div>
    </div>
  );
}
