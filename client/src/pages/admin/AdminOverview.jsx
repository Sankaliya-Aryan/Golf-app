import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Hash, Trophy, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalScores: 0,
    totalDraws: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/admin/analytics');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load analytics overview');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Platform Overview</h1>
          <p className="text-text-muted">High-level metrics and statistics across the entire charity ecosystem.</p>
        </div>
        <Link 
          to="/admin/draws" 
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/25 whitespace-nowrap flex items-center gap-2"
        >
          Manage Official Draws <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border hover:border-blue-500/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-muted font-bold text-sm tracking-widest uppercase">Total Users</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{stats.totalUsers}</p>
        </div>

        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border hover:border-success/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-muted font-bold text-sm tracking-widest uppercase">Subscribers</h3>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{stats.activeSubscribers}</p>
        </div>

        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border hover:border-purple-500/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-muted font-bold text-sm tracking-widest uppercase">Scores Entered</h3>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Hash className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{stats.totalScores}</p>
        </div>

        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-muted font-bold text-sm tracking-widest uppercase">Total Draws</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{stats.totalDraws}</p>
        </div>
      </div>
      
      {/* Estimated Prize Pool Calculation Box */}
      <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xl bg-gradient-to-br from-card to-background">
         <h3 className="text-xl font-extrabold text-white mb-2">Estimated Prize Pool & Charity Contribution</h3>
         <p className="text-text-muted mb-6 max-w-2xl">Real-time estimated calculation showing potential platform velocity based on your user growth and subscription tiers.</p>
         
         <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border border-primary/20 bg-primary/5 rounded-xl">
               <span className="text-primary text-sm font-bold tracking-widest uppercase mb-1 block">Total Raised</span>
               <span className="text-3xl font-black text-white">${(stats.activeSubscribers * 9.99).toFixed(2)}</span>
            </div>
            <div className="p-5 border border-success/20 bg-success/5 rounded-xl">
               <span className="text-success text-sm font-bold tracking-widest uppercase mb-1 block">Charity Allocation</span>
               <span className="text-3xl font-black text-white">${((stats.activeSubscribers * 9.99) * 0.4).toFixed(2)}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminOverview;
