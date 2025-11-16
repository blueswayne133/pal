import { Navigate, useLocation } from "react-router-dom";
import { getAdminFromLocalStorage, getAdminToken } from "../utils/localStorage";

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  const adminToken = getAdminToken();
  const adminData = getAdminFromLocalStorage();
  
  if (!adminToken || !adminData) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;