import { Link } from 'react-router-dom';
import { Home, Compass, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-xl w-full text-center relative z-10">
        <div className="flex justify-center mb-8 animate-bounce">
          <div className="w-24 h-24 bg-card border-2 border-border shadow-2xl rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
            <AlertTriangle className="w-12 h-12 text-primary relative z-10" />
          </div>
        </div>

        <h1 className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-text-muted mb-4 drop-shadow-xl">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
          Out of Bounds! ⛳
        </h2>

        <p className="text-lg text-text-muted mb-10 max-w-md mx-auto leading-relaxed">
          Looks like your ball landed in the rough. The page you are looking for doesn't exist or you don't have access to view it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-card text-white hover:bg-background hover:border-primary/50 transition-all font-bold flex items-center justify-center space-x-2"
          >
            <Compass className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          
          <Link 
            to="/" 
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white shadow-lg shadow-primary/25 transition-all font-bold flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Return to Clubhouse</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
