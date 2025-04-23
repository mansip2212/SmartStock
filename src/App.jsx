import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './config/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import PublicRoute from './config/PublicRoute';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
