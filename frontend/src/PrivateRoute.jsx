import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("Access Denied: You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;