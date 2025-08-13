import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedLayout() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/register" replace />;
}
