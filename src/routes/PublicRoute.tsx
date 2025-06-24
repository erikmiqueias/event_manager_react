import Loading from "@/components/Loading";
import useAuthentication from "@/hooks/useAuthentication";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuthentication();

  if (isAuthenticated === null) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return element;
};

export default PublicRoute;
