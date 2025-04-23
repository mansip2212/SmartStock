import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";// Assuming you have AuthContext

const PublicRoute = ({ element }) => {
  const { user } = useAuth(); // Get user from AuthContext

  return user ? <Navigate to="/dashboard" /> : element;
};

export default PublicRoute;
