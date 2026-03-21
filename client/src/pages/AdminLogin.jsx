import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, ShieldAlert, FileSignature } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (!data.isAdmin) {
        toast.error('Access Denied. You are not an admin.');
        setIsSubmitting(false);
        return;
      }
      
      login(data);
      toast.success('Admin authentication successful');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 font-sans relative">
       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
       
      <div className="w-full max-w-md bg-card p-6 sm:p-10 rounded-2xl border border-primary/30 shadow-2xl relative z-10 shadow-primary/10">
        <div className="text-center mb-6 sm:mb-8">
           <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
             <ShieldAlert className="w-8 h-8 text-white" />
           </div>
          <h2 className="text-3xl font-black text-white mb-2">Admin Portal</h2>
          <p className="text-text-muted text-sm font-medium">Secured staff access only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-border"
              placeholder="admin@platform.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-border"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-1 pb-3">
             <input type="checkbox" id="remember" className="rounded bg-background border-border text-primary focus:ring-primary/50" />
             <label htmlFor="remember" className="text-sm font-medium text-text-muted">Remember me on this device</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white rounded-xl font-black text-lg transition-all flex justify-center items-center shadow-lg shadow-primary/25 disabled:opacity-50 space-x-2"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Secure Login</span>
                <LogIn className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <Link to="/login" className="text-text-muted hover:text-white text-sm font-bold transition-colors inline-block">
            ← Back to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
