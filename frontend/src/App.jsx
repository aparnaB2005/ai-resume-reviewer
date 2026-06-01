import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import History from "./pages/History";

export default function App(){


  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="min-h-screen bg-[#0F0F1A] text-white">
        <Navbar/>
        <Routes>
            <Route path="/"          element={<Navigate to="/home" replace />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            {/* Protected — must be logged in */}
            <Route path="/home" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            }/>
            <Route path="/history" element={
              <ProtectedRoute><History /></ProtectedRoute>
            }/>
        </Routes>

      </div>
      </BrowserRouter>
    </AuthProvider>

  )
}