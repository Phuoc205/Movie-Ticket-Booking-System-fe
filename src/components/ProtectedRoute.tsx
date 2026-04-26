import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }: any) => {
  const auth = useContext(AuthContext);

  if (!auth || auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.user || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  const role = auth.user.role?.trim();

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;