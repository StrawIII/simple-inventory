import { useContext, useEffect } from "react";
import { Table } from "../components/Table";
import { UserContext } from "../context/User";
import { useLocation } from "react-router-dom";

export function Dashboard() {
  const { pathname } = useLocation()
  const { validateUserAccess } = useContext(UserContext)

  useEffect(() => {
    pathname && validateUserAccess(pathname)
  }, [validateUserAccess, pathname])
  return (
    <Table />
  );
}
