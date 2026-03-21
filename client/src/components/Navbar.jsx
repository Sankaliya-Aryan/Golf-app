import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, User as UserIcon, Settings, Home, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
                Fairway<span className="text-primary font-black">Fund</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' 
                      : 'text-text-muted hover:text-white hover:bg-background/50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium ${
                      isActive('/admin') 
                        ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' 
                        : 'text-text-muted hover:text-white hover:bg-background/50'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-2 sm:space-x-3 ml-1 sm:ml-4 pl-1 sm:pl-4 border-l border-border">
                  <Link to="/profile" className="flex items-center space-x-2 sm:space-x-3 group outline-none">
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors leading-none mb-1">
                        {user.name}
                      </span>
                      <span className="text-xs text-text-muted font-medium leading-none">
                        {user.isAdmin ? 'Administrator' : 'Player'}
                      </span>
                    </div>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                      <div className="h-full w-full rounded-full bg-card flex items-center justify-center border-2 border-transparent">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                          {getInitials(user.name)}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 text-text-muted hover:text-white bg-background/50 hover:bg-danger hover:shadow-lg hover:shadow-danger/20 transition-all duration-300 rounded-lg group"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/demo" className="text-text-muted hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Demo
                </Link>
                <Link to="/login" className="text-text-muted hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
