import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import logo from "../assets/logo.png";
import { useAuth } from "../config/AuthContext";
import { getAuth, signOut} from "firebase/auth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext
  const auth = getAuth();
  const location = useLocation(); 
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="SmartStock Logo" className="h-7 w-auto" />
          <h1 className="text-2xl font-bold text-gray-900 ml-2">
            SmartStock
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-6 text-gray-700">
          <li>
            <Link to="/"
              className={`pb-1 ${
                isActive("/") ? "border-b-2 font-bold border-purple-700" : "hover:border-b-2 hover:font-semibold hover:border-gray-600"}`}>
                  Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`pb-1.5 ${isActive("/dashboard") ? "border-b-2 font-bold border-purple-700" : "hover:border-b-2 hover:font-semibold hover:border-gray-600"}`}>
              Inventory
            </Link>
          </li>
          <li><Link
              to="/analytics"
              className={`pb-1.5 ${isActive("/analytics") ? "border-b-2 font-bold border-purple-700" : "hover:border-b-2 hover:font-semibold hover:border-gray-600"}`}>
              Analytics
            </Link></li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
        <div className="hidden md:flex space-x-4">
          {user ? (
            <>
              <span className="pt-2 text-gray-700 font-medium">Hello, {user.email}</span>
              <button onClick={handleSignOut} className="text-purple-700 hover:text-white bg-transparent border cursor-pointer hover:bg-purple-600 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center">
              <svg className="w-3.5 h-3.5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor"  d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"/>
              </svg>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin">
              <button className="text-purple-700 hover:text-white bg-transparent border cursor-pointer hover:bg-purple-600 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
              <svg className="w-3.5 h-3.5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                  <path stroke="currentColor" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
              </svg>
                Sign In
              </button>
            </Link>
          )}
        </div>

          <button className="text-white bg-purple-600 border hover:bg-purple-700 cursor-pointer focus:ring-1 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-6 py-2 text-center inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4.5 h-4.5 me-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
            Help
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <ul className="md:hidden bg-white shadow-md flex flex-col items-center space-y-4 py-4">
          <li><Link to="/"
              className={`pb-1 ${isActive("/") ? "border-b-2 font-bold border-purple-700" : "hover:border-b-2 hover:font-semibold hover:border-gray-600"}`}
              onClick={() => setIsOpen(false)}>
                Home
              </Link>
          </li>
          <li>
            <Link to="/dashboard" className={`pb-1.5 ${
                isActive("/dashboard") ? "border-b-2 font-bold border-purple-700" : "hover:border-b-2 hover:font-semibold hover:border-gray-600"
              }`}
              onClick={() => setIsOpen(false)}>
              Inventory
            </Link>
          </li>
          <li>
            <Link to="/analytics" className={`pb-1.5 ${
                isActive("/analytics") ? "border-b-2 font-bold border-purple-700" : "hover:border-b-2 hover:font-semibold hover:border-gray-600"
              }`}
              onClick={() => setIsOpen(false)}>
              Analytics
            </Link>
          </li>
          
          {/* Mobile Buttons */}
          {user ? (
            <>
              <span className="text-gray-700 font-medium">Hello, {user.email}</span>
              <button onClick={handleSignOut} className="text-purple-700 hover:text-white bg-transparent border cursor-pointer hover:bg-purple-600 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin">
              <button className="text-purple-700 hover:text-white bg-transparent border cursor-pointer hover:bg-purple-600 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5">
                Sign In
              </button>
            </Link>
          )}

          <button className="text-white bg-purple-600 border hover:bg-purple-700 cursor-pointer focus:ring-1 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center">
            Help
          </button>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
