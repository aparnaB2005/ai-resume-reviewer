import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold">
            AI
          </div>
          <span className="font-semibold text-lg tracking-tight">ResumeAI</span>
        </Link>

        {/* Nav links */}
        {user && (
          <div className="flex items-center gap-6">
            <Link to="/home"    className="text-sm text-white/70 hover:text-white transition">Reviewer</Link>
            <Link to="/history" className="text-sm text-white/70 hover:text-white transition">History</Link>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
              <span className="text-sm text-white/50">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}