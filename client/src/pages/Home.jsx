import { Link } from 'react-router-dom';
import { Activity, Trophy, Heart } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center py-12 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Play Golf. <span className="text-primary">Support Charity.</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10">
          Join our premium subscription platform. Track your latest golf scores, participate in exclusive draws, and support your favorite charitable causes.
        </p>
        <div className="flex justify-center flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold text-lg transition-colors shadow-lg shadow-primary/20"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-card border border-border hover:bg-border text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/demo"
            className="px-8 py-3 bg-transparent border border-primary text-primary hover:bg-primary/10 rounded-lg font-semibold text-lg transition-colors"
          >
            View Demo
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
        <div className="bg-card p-6 sm:p-8 rounded-xl border border-border hover:border-primary/50 transition-colors group">
          <div className="h-12 w-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Track Scores</h3>
          <p className="text-text-muted">
            Record your last 5 golf scores on our beautiful dashboard. Keep track of your performance over time.
          </p>
        </div>

        <div className="bg-card p-6 sm:p-8 rounded-xl border border-border hover:border-success/50 transition-colors group">
          <div className="h-12 w-12 bg-success/20 text-success rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Support Causes</h3>
          <p className="text-text-muted">
            Select your preferred charity. A portion of your subscription goes directly to making the world a better place.
          </p>
        </div>

        <div className="bg-card p-6 sm:p-8 rounded-xl border border-border hover:border-blue-500/50 transition-colors group">
          <div className="h-12 w-12 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Win Big</h3>
          <p className="text-text-muted">
            Match your golf scores with our regular draws. Match 3, 4, or 5 numbers to win exclusive platform rewards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
