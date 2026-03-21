import { useState } from 'react';
import { PlusCircle, CreditCard, Heart, Trophy, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Demo = () => {
  const [newScore, setNewScore] = useState('');
  
  // Static Demo Data
  const scores = [
    { _id: '1', score: 12, createdAt: new Date(Date.now() - 86400000 * 1) },
    { _id: '2', score: 34, createdAt: new Date(Date.now() - 86400000 * 2) },
    { _id: '3', score: 7, createdAt: new Date(Date.now() - 86400000 * 3) },
    { _id: '4', score: 42, createdAt: new Date(Date.now() - 86400000 * 4) },
    { _id: '5', score: 19, createdAt: new Date(Date.now() - 86400000 * 5) }
  ];
  const myNumbers = scores.map(s => s.score);
  const drawNumbers = [12, 5, 42, 19, 30]; // 3 matches: 12, 42, 19
  const matchCount = 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      
      {/* Demo Overlay Banner */}
      <div className="bg-primary/20 border border-primary text-white p-4 rounded-xl flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Info className="w-5 h-5 mr-3 text-primary" />
          <p className="font-medium">You are viewing <strong className="text-primary">Demo Mode</strong>. Data is for preview purposes only.</p>
        </div>
        <Link to="/signup" className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg font-bold text-sm transition-colors">
          Create Real Account
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 opacity-90">
        {/* Subscription Card */}
        <div className="flex-1 bg-card p-6 rounded-xl border border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center mb-1">
                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                Subscription
              </h3>
              <p className="text-text-muted text-sm">Manage your platform access</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/20 text-success">
              ACTIVE
            </span>
          </div>
          <button className="w-full py-2 rounded-lg font-medium transition-colors bg-border text-white cursor-not-allowed">
            Cancel Subscription (Demo)
          </button>
        </div>

        {/* Charity Card */}
        <div className="flex-1 bg-card p-6 rounded-xl border border-border">
          <div className="mb-4">
            <h3 className="text-xl font-bold flex items-center mb-1">
              <Heart className="w-5 h-5 mr-2 text-success" />
              Your Charity
            </h3>
            <p className="text-text-muted text-sm">Select who you're playing for</p>
          </div>
          <div className="flex gap-2">
            <input type="text" disabled value="Global Red Cross" className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-text-muted" />
            <button disabled className="px-4 py-2 bg-card border border-border rounded-lg text-text-muted cursor-not-allowed">
              Update
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 opacity-90">
        {/* Scores Section */}
        <div className="bg-card p-6 rounded-xl border border-border flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <PlusCircle className="w-5 h-5 mr-2 text-primary" />
            Your Scores
            <span className="ml-2 text-xs font-normal text-text-muted">(Last 5 only)</span>
          </h3>

          <div className="flex gap-2 mb-8">
            <input type="number" disabled placeholder="Enter score (1-45)" className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-text-muted cursor-not-allowed focus:outline-none" />
            <button disabled className="px-6 py-3 bg-primary/50 text-white/50 rounded-lg font-medium cursor-not-allowed">
              Add Score
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {scores.map((score, idx) => (
              <div key={score._id} className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center">
                  <span className="text-text-muted text-sm w-6">#{idx + 1}</span>
                  <span className="font-bold text-lg">{score.score}</span>
                </div>
                <span className="text-text-muted text-sm">
                  {score.createdAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Draw System Section */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-blue-500" />
            Latest Draw Results
          </h3>

          <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border mb-6">
            <span className="text-text-muted">Draw Date:</span>
            <span className="font-medium text-white">
              {new Date().toLocaleString()}
            </span>
          </div>

          <div className="flex justify-center gap-3 mb-10">
            {drawNumbers.map((num, i) => {
              const isMatch = myNumbers.includes(num);
              return (
                <div 
                  key={i} 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 transition-all duration-500 ${
                    isMatch 
                      ? 'border-success bg-success/20 text-success shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                      : 'border-border bg-background text-text-muted'
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          {/* Match Result Display */}
          <div className="text-center p-6 bg-background rounded-xl border border-border relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-text-muted font-medium mb-2">Your Matches</h4>
              <div className="text-4xl font-extrabold mb-2">
                {matchCount} <span className="text-lg text-text-muted font-normal">/ 5</span>
              </div>
              <div className="text-success font-bold mt-4 px-4 py-2 bg-success/10 rounded-full inline-block">
                WINNER: {matchCount} MATCHES! 🎊
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-success/20 via-transparent to-transparent opacity-50 z-0 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
