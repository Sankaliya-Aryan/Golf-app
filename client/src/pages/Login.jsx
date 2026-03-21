import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.isAdmin) {
        toast.error('Use admin login page', { icon: '🛡️' });
        setIsLoading(false);
        return;
      }
      
      login(data);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-4 sm:mx-auto mt-10 sm:mt-20 p-5 sm:p-6 bg-card rounded-2xl border border-border shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/20 text-primary rounded-full mb-4">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-text-muted mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-text-muted">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-primary hover:text-primary-hover font-medium">
          Sign up
        </Link>
      </div>
      <div className="mt-5 pt-5 border-t border-border text-center text-xs text-text-muted font-bold tracking-wider uppercase">
        <Link to="/admin-login" className="hover:text-white transition-colors">
          Login as Admin?
        </Link>
      </div>
    </div>
  );
};

export default Login;
