import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

const ProtectedRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
