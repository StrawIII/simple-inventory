import { useContext, useEffect } from "react";
import { DragAndDrop } from "../components/DragAndDrop";
import { UserContext } from "../context/User";
import { useLocation } from "react-router-dom";

export function Admin() {
  const {pathname} = useLocation()
  const {validateUserAccess} = useContext(UserContext)

  useEffect(() => {
    pathname && validateUserAccess(pathname)
  }, [validateUserAccess, pathname])
  
  return (
    <div className="flex h-full w-full min-w-80 items-center justify-center">
      <DragAndDrop />
    </div>
  );
}
