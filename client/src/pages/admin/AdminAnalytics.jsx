import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AreaChart, Calendar, Target, TrendingUp, HandHeart } from 'lucide-react';
import api from '../../services/api';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load advanced analytics');
    }
  };

  if (!data) return <div className="p-8 text-center text-text-muted">Loading Analytics...</div>;

  const estimatedRevenue = data.activeSubscribers * 9.99;
  const charityContribution = estimatedRevenue * 0.40; // 40% to charity

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center">
          <AreaChart className="w-8 h-8 mr-3 text-primary" />
          Advanced Analytics
        </h1>
        <p className="text-text-muted mt-2">Deep dive into platform revenues, charity selections, and historical draw data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
           <h3 className="text-xs font-black tracking-widest text-primary uppercase mb-3 flex items-center">
             <TrendingUp className="w-4 h-4 mr-2" />
             Monthly Revenue Earning
           </h3>
           <p className="text-4xl font-black text-white">${estimatedRevenue.toFixed(2)}</p>
           <p className="text-xs font-bold text-text-muted mt-2 tracking-wide text-success">Active Subscription MRR</p>
        </div>

        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-success/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
           <h3 className="text-xs font-black tracking-widest text-success uppercase mb-3 flex items-center">
             <HandHeart className="w-4 h-4 mr-2" />
             Charity Allocation
           </h3>
           <p className="text-4xl font-black text-white">${charityContribution.toFixed(2)}</p>
           <p className="text-xs font-bold text-text-muted mt-2 tracking-wide">40% of Global Revenue</p>
        </div>

        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
           <h3 className="text-xs font-black tracking-widest text-purple-400 uppercase mb-3 flex items-center">
             <Target className="w-4 h-4 mr-2" />
             Favorite Charity
           </h3>
           <p className="text-2xl font-black text-white leading-tight mt-1">{data.mostSelectedCharity}</p>
           <p className="text-xs font-bold text-text-muted mt-2 tracking-wide">By User Selection</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl mt-8">
        <div className="p-5 sm:p-6 border-b border-border bg-background/30 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-text-muted" />
            Draw History (Recent 10)
          </h2>
        </div>
        <div className="p-0">
           {data.drawHistory && data.drawHistory.length > 0 ? (
             <div className="divide-y divide-border">
                {data.drawHistory.map((draw) => (
                   <div key={draw._id} className="p-4 hover:bg-background/50 transition-colors flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-white mb-1">
                            {new Date(draw.createdAt).toLocaleString()}
                         </span>
                         <span className="text-xs font-medium text-text-muted">Draw ID: {draw._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div className="flex gap-2">
                         {draw.numbers.map((num, i) => (
                           <div key={i} className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center font-black text-sm text-text">
                              {num}
                           </div>
                         ))}
                      </div>
                   </div>
                ))}
             </div>
           ) : (
             <div className="p-8 text-center text-text-muted text-sm border-t border-border">No draw history available yet.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
