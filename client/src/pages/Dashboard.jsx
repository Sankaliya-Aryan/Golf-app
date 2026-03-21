import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, CreditCard, Heart, Trophy, Lock, Award, TrendingUp, Inbox, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  
  const [scores, setScores] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [newScore, setNewScore] = useState('');
  const [charity, setCharity] = useState(user?.charity || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scoresRes, drawRes, subRes] = await Promise.all([
        api.get('/scores'),
        api.get('/draws/latest'),
        api.get('/users/subscription').catch(() => ({ data: null }))
      ]);
      setScores(scoresRes.data);
      setLatestDraw(drawRes.data);
      if (subRes.data) {
        setSubscriptionDetails(subRes.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      await api.post('/users/subscribe', { plan });
      updateUser({ isSubscribed: true });
      toast.success(`Successfully activated ${plan} plan!`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await api.put('/users/cancel');
      updateUser({ isSubscribed: false });
      setSubscriptionDetails(null);
      toast.success('Subscription cancelled.');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleUpdateCharity = async () => {
    if (!charity) {
      toast.error('Please enter a charity name');
      return;
    }
    try {
      const { data } = await api.put('/users/charity', { charity });
      updateUser({ charity: data.charity });
      toast.success('Charity preference saved');
    } catch (error) {
      toast.error('Failed to update charity');
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!user.isSubscribed) {
      toast.error('You must be subscribed to add scores');
      return;
    }

    const numScore = parseInt(newScore, 10);
    if (isNaN(numScore) || numScore < 1 || numScore > 45) {
      toast.error('Score must be between 1 and 45');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/scores', { score: numScore });
      toast.success('Score successfully recorded!');
      setNewScore('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add score');
    } finally {
      setIsSubmitting(false);
    }
  };

  const myNumbers = scores.map(s => s.score);
  const drawNumbers = latestDraw ? latestDraw.numbers : [];
  const matchCount = myNumbers.filter(num => drawNumbers.includes(num)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 font-sans">
      
      {/* Header & Stats Strip */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-text-muted">Here is what is happening with your scores and subscriptions today.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 sm:mt-8">
          <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border/50 shadow-lg shadow-black/20 hover:border-primary/50 transition-colors">
            <div className="flex items-center space-x-2 text-text-muted mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-wider">Entries</span>
            </div>
            <p className="text-3xl font-black text-white">{scores.length} <span className="text-sm font-medium text-text-muted">/ 5 max</span></p>
          </div>
          
          <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border/50 shadow-lg shadow-black/20 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center space-x-2 text-text-muted mb-3">
              <Award className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold uppercase tracking-wider">Matches</span>
            </div>
            <p className="text-3xl font-black text-white">{matchCount}</p>
          </div>

          <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border/50 shadow-lg shadow-black/20 hover:border-success/50 transition-colors">
            <div className="flex items-center space-x-2 text-text-muted mb-3">
              <Heart className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold uppercase tracking-wider">Playing For</span>
            </div>
            <p className="text-lg font-bold text-white truncate">{user.charity || 'None Set'}</p>
          </div>

          <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border/50 shadow-lg shadow-black/20 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center space-x-2 text-text-muted mb-3">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold uppercase tracking-wider">Status</span>
            </div>
            <p className={`text-lg font-bold ${user.isSubscribed ? 'text-success' : 'text-danger'}`}>
              {user.isSubscribed ? 'Active' : 'Expired'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: Settings & Subscription */}
        <div className="space-y-6 sm:space-y-8 lg:col-span-1">
          {/* Subscription Manager */}
          {user.isSubscribed && subscriptionDetails ? (
            <div className="relative overflow-hidden bg-card p-5 sm:p-6 rounded-2xl border border-success/30 shadow-xl shadow-success/5">
              <div className="absolute top-0 left-0 w-full h-1 bg-success"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-1 capitalize text-success">
                    {subscriptionDetails.plan} Plan
                  </h3>
                  <p className="text-sm text-text-muted">
                    Expires: {new Date(subscriptionDetails.expiry).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-success/20 text-success text-xs font-bold rounded-full">ACTIVE</span>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs text-text-muted mb-2 font-medium">
                  <span>{subscriptionDetails.daysRemaining} days remaining</span>
                </div>
                <div className="w-full bg-background rounded-full h-2.5 shadow-inner">
                  <div 
                    className="bg-success h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (subscriptionDetails.daysRemaining / (subscriptionDetails.plan === 'yearly' ? 365 : 30)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleCancelSubscription}
                className="w-full py-3 rounded-xl font-bold transition-all duration-300 bg-background hover:bg-danger/10 border border-border hover:border-danger/50 text-white hover:text-danger"
              >
                Cancel Subscription
              </button>
            </div>
          ) : (
            <div className="bg-card p-5 sm:p-6 rounded-2xl border border-danger/30 shadow-xl shadow-danger/5 space-y-4 sm:space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-danger"></div>
              <div className="mb-2">
                <h3 className="text-xl font-extrabold text-white flex items-center mb-1">Unlock Features</h3>
                <p className="text-text-muted text-sm leading-relaxed">Select a subscription plan to start adding scores and winning draws.</p>
              </div>
              
              {/* Monthly Plan */}
              <div className="p-4 border border-border bg-background rounded-xl hover:border-primary/50 transition-all flex flex-col justify-between items-start gap-4">
                <div className="flex justify-between w-full items-center">
                  <div>
                    <h4 className="font-bold text-white text-lg">Monthly</h4>
                    <p className="text-xs text-text-muted">30 days of full access</p>
                  </div>
                  <span className="text-xl font-black text-white">$9<span className="text-sm text-text-muted">.99</span></span>
                </div>
                <button
                  onClick={() => handleSubscribe('monthly')}
                  className="w-full py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg font-bold transition-all border border-primary/20"
                >
                  Subscribe Monthly
                </button>
              </div>

              {/* Yearly Plan */}
              <div className="p-4 border border-primary/40 bg-primary/5 rounded-xl transition-all flex flex-col justify-between items-start gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
                <div className="flex justify-between w-full items-center">
                  <div>
                    <h4 className="font-bold text-white text-lg">Yearly</h4>
                    <p className="text-xs text-primary font-medium">Save 15% immediately</p>
                  </div>
                  <span className="text-xl font-black text-white">$99<span className="text-sm text-text-muted">.99</span></span>
                </div>
                <button
                  onClick={() => handleSubscribe('yearly')}
                  className="w-full py-2.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white shadow-primary/25 shadow-lg rounded-lg font-bold transition-all"
                >
                  Subscribe Yearly
                </button>
              </div>
            </div>
          )}

          {/* Charity Card */}
          <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xl">
            <div className="mb-5">
              <h3 className="text-xl font-extrabold flex items-center mb-1 text-white">
                Charity Preference
              </h3>
              <p className="text-text-muted text-sm">Where should your winnings be donated?</p>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={charity}
                  onChange={(e) => setCharity(e.target.value)}
                  placeholder="e.g. WWF, Red Cross"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-border"
                />
              </div>
              <button
                onClick={handleUpdateCharity}
                className="w-full py-3 bg-card border border-border hover:bg-background hover:border-primary/50 hover:text-primary rounded-xl text-white font-bold transition-all"
              >
                Save Preference
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Scores Section */}
        <div className="bg-card p-5 sm:p-8 rounded-2xl border border-border shadow-xl flex flex-col lg:col-span-1 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-extrabold flex items-center text-white">
              Golf Scores
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-background border border-border rounded-full text-text-muted">
              LATEST 5
            </span>
          </div>

          {!user.isSubscribed && (
            <div className="absolute inset-0 z-10 bg-card/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-border shadow-2xl">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Scores Locked</h4>
              <p className="text-text-muted text-sm max-w-xs leading-relaxed">You need an active subscription plan to add scores and enter the draw mechanics.</p>
            </div>
          )}

          <form onSubmit={handleAddScore} className="mb-8 relative z-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="1-45"
                  disabled={!user.isSubscribed || isSubmitting}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none disabled:opacity-50 text-white font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!user.isSubscribed || isSubmitting}
                className="px-5 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </form>

          <div className="flex-1 flex flex-col gap-3 relative z-0">
            {scores.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center bg-background/50">
                <Inbox className="w-10 h-10 text-border mb-3" />
                <p className="text-text-muted text-sm font-medium">No scores recorded yet.</p>
                <p className="text-xs text-border mt-1">Play a round and add a score.</p>
              </div>
            ) : (
              scores.map((score, idx) => (
                <div key={score._id} className="group flex justify-between items-center p-4 bg-background hover:bg-background/80 rounded-xl border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-card text-text-muted text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-black text-2xl text-white group-hover:text-primary transition-colors">{score.score}</span>
                  </div>
                  <span className="text-text-muted text-xs font-medium bg-card px-2 py-1 rounded-md">
                    {new Date(score.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Draw System Section */}
        <div className="bg-card p-5 sm:p-8 rounded-2xl border border-border shadow-xl lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-extrabold flex items-center text-white">
              Latest Draw
            </h3>
            {latestDraw && (
              <span className="text-xs font-bold text-text-muted">
                {new Date(latestDraw.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {latestDraw ? (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-center flex-wrap gap-2 mb-10 mt-4">
                {drawNumbers.map((num, i) => {
                  const isMatch = myNumbers.includes(num);
                  return (
                    <div 
                      key={i} 
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-4 transition-all duration-500 shadow-xl ${
                        isMatch 
                          ? 'border-success bg-background text-success shadow-success/40 scale-110' 
                          : 'border-border bg-background text-text-muted'
                      }`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>

              {/* Match Result Display */}
              <div className="mt-auto relative rounded-2xl overflow-hidden border border-border bg-background flex flex-col justify-center min-h-[160px]">
                <div className={`absolute inset-0 opacity-20 transition-all duration-1000 ${
                  matchCount >= 3 ? 'bg-gradient-to-t from-success to-transparent' : 'bg-transparent'
                }`}></div>
                
                <div className="relative z-10 p-6 flex flex-col items-center text-center">
                  <h4 className="text-text-muted text-sm font-bold uppercase tracking-wider mb-2">Matches Found</h4>
                  <div className="text-5xl font-black text-white mb-4">
                    {matchCount} <span className="text-2xl text-text-muted font-normal">/ 5</span>
                  </div>
                  
                  {matchCount >= 3 ? (
                    <div className="w-full py-3 bg-success text-white rounded-xl font-black tracking-wide shadow-lg shadow-success/30 animate-pulse">
                      {matchCount === 5 ? 'JACKPOT WINNER! 🏆' : `WINNER (${matchCount} MATCHES) 🎉`}
                    </div>
                  ) : (
                    <div className="w-full py-2 bg-card border border-border text-text-muted rounded-xl font-medium text-sm">
                      Match 3 or more to win.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center bg-background/50">
              <Trophy className="w-10 h-10 text-border mb-3" />
              <p className="text-text-muted text-sm font-medium">No draws generated yet.</p>
              <p className="text-xs text-border mt-1">Wait for admin to run the monthly draw.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
