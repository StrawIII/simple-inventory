export type SidebarItemProps = {
  label: string;
  expanded: boolean;
};

export function SidebarItem({ label, expanded }: SidebarItemProps) {
  return (
    <div className="m-5 flex rounded-xl bg-red-300 p-5">
      <img src="/src/assets/alarm.svg" />
      <div className={`${expanded ? "" : "hidden"}`}>{label}</div>
    </div>
  );
}
