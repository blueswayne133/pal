import { Navigate, useLocation } from "react-router-dom";
import { getUserFromLocalStorage, getToken } from "../utils/localStorage";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  const token = getToken();
  const userData = getUserFromLocalStorage();
  
  if (!token || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;