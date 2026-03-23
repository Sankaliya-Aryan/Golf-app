import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trophy, PlayCircle, Dices, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const AdminDraws = () => {
  const [latestDraw, setLatestDraw] = useState(null);
  const [winners, setWinners] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timerSettings, setTimerSettings] = useState(null);
  const [timeLimitInput, setTimeLimitInput] = useState(2);
  const [timeLeft, setTimeLeft] = useState({ min: '00', sec: '00' });
  const [timerActive, setTimerActive] = useState(false);
  const [isUpdatingTimer, setIsUpdatingTimer] = useState(false);
  const [showDrawConfirm, setShowDrawConfirm] = useState(false);

  useEffect(() => {
    fetchLatestDraw();
    fetchWinners();
    fetchTimerConfig();
  }, []);

  useEffect(() => {
    if (!timerSettings || !timerSettings.isOpen || !timerSettings.endTime) {
       setTimerActive(false);
       setTimeLeft({ min: '00', sec: '00' });
       return;
    }

    const checkTimer = () => {
      const now = new Date();
      const end = new Date(timerSettings.endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimerActive(false);
        setTimeLeft({ min: '00', sec: '00' });
        return false;
      } else {
        setTimerActive(true);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({
          min: m.toString().padStart(2, '0'),
          sec: s.toString().padStart(2, '0')
        });
        return true;
      }
    };

    const stillActive = checkTimer();
    let intervalId;
    
    if (stillActive) {
      intervalId = setInterval(() => {
        const isActive = checkTimer();
        if (!isActive) clearInterval(intervalId);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerSettings]);

  const fetchTimerConfig = async () => {
    try {
      const { data } = await api.get('/draws/timer');
      setTimerSettings(data);
      if (data.timeLimitMinutes) setTimeLimitInput(data.timeLimitMinutes);
    } catch (error) {
      console.error('Failed to load timer', error);
    }
  };

  const handleTimerAction = async (action) => {
    setIsUpdatingTimer(true);
    try {
      const { data } = await api.put('/draws/timer', {
        timeLimitMinutes: Number(timeLimitInput),
        action
      });
      setTimerSettings(data);
      toast.success(action === 'start' ? 'Timer started!' : 'Timer stopped/Entries closed.');
    } catch (error) {
      toast.error('Failed to update timer');
    } finally {
      setIsUpdatingTimer(false);
    }
  };

  const fetchLatestDraw = async () => {
    try {
      const { data } = await api.get('/draws/latest');
      setLatestDraw(data);
    } catch (error) {
      toast.error('Failed to load latest draw');
    }
  };

  const fetchWinners = async () => {
    try {
      const { data } = await api.get('/admin/winners');
      setWinners(data);
    } catch (error) {
      toast.error('Failed to load winners history');
    }
  };

  const handleGenerateDraw = async () => {
    setShowDrawConfirm(false);
    setIsGenerating(true);
    try {
      const { data } = await api.post('/draws');
      toast.success('Draw generated and timer restarted!');
      setLatestDraw(data);
      fetchWinners();
      fetchTimerConfig();
    } catch (error) {
      toast.error('Failed to generate draw');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.put(`/admin/winners/${id}/pay`);
      toast.success('Winner marked as Paid');
      fetchWinners();
    } catch (error) {
      toast.error('Failed to update payout status');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Draw & Winner Records</h1>
          <p className="text-text-muted">Generate official draws and manage winner payouts.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 bg-background p-2 rounded-xl border border-border">
            <span className="text-sm text-text-muted font-bold ml-2">Mins:</span>
            <input 
              type="number" 
              value={timeLimitInput} 
              onChange={e => setTimeLimitInput(e.target.value)} 
              className="w-16 bg-card border-none outline-none text-white text-center font-bold"
              min="1"
            />
          </div>

          {!timerActive ? (
            <button
              onClick={() => handleTimerAction('start')}
              disabled={isGenerating || isUpdatingTimer}
              className="flex-1 sm:flex-none py-2 px-4 bg-card border border-success text-success hover:bg-success/10 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isUpdatingTimer ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              <span>{isUpdatingTimer ? 'Starting...' : 'Start Timer'}</span>
            </button>
          ) : (
            <button
              onClick={() => handleTimerAction('stop')}
              disabled={isGenerating || isUpdatingTimer}
              className="flex-1 sm:flex-none py-2 px-4 bg-card border border-danger text-danger hover:bg-danger/10 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 animate-pulse disabled:opacity-50 disabled:animate-none"
            >
              <Loader2 className={`w-4 h-4 ${isUpdatingTimer ? 'animate-spin' : ''}`} />
              <span>{isUpdatingTimer ? 'Stopping...' : `${timeLeft.min}:${timeLeft.sec} - Stop`}</span>
            </button>
          )}

          <button
            onClick={() => setShowDrawConfirm(true)}
            disabled={isGenerating}
            className="flex-1 sm:flex-none py-2 px-6 bg-gradient-to-r from-danger to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg shadow-danger/25 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            <span>{isGenerating ? 'Running...' : 'Run Official Draw'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Latest Draw Info */}
        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xl lg:col-span-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-primary" />
              Recent Numbers
            </h2>
            {latestDraw && (
               <span className="text-xs font-bold px-3 py-1 bg-background border border-border rounded-full text-text-muted">
                 {new Date(latestDraw.createdAt).toLocaleDateString()}
               </span>
            )}
          </div>
          
          {latestDraw ? (
            <div className="flex justify-center flex-wrap gap-2 mt-4">
              {latestDraw.numbers.map((num, i) => (
                <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black bg-primary shadow-sm text-white">
                  {num}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-text-muted border-2 border-dashed border-border rounded-xl bg-background/50">
              No draws have been recorded.
            </div>
          )}
        </div>

        {/* Winners Table */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-border">
            <h2 className="text-xl font-extrabold text-white">Winner Verification & Payouts</h2>
            <p className="text-sm text-text-muted mt-1">Users matching 3 or more numbers from any draw.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Winner</th>
                  <th className="px-6 py-4 font-bold text-center">Matches</th>
                  <th className="px-6 py-4 font-bold text-center">Prize</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {winners.length === 0 ? (
                   <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-text-muted text-sm border-t border-border">No winners generated yet. Run a draw to test.</td>
                   </tr>
                ) : winners.map((winner) => (
                  <tr key={winner._id} className="hover:bg-background/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{winner.userId?.name || 'Unknown'}</div>
                      <div className="text-xs text-text-muted">Draw: {new Date(winner.drawId?.createdAt).toLocaleDateString()}</div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex font-black text-lg text-white">
                        {winner.matchCount} <span className="text-text-muted font-medium text-xs ml-1 mt-1">/ 5</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-success">
                      ${winner.prizeAmount?.toLocaleString() || '0'}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        winner.status === 'Paid' ? 'bg-success/20 text-success' : 'bg-orange-500/20 text-orange-500'
                      }`}>
                        {winner.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {winner.status === 'Pending' ? (
                        <button
                          onClick={() => handleMarkPaid(winner._id)}
                          className="px-4 py-1.5 bg-success/10 border border-success/50 hover:bg-success hover:text-white text-success rounded-lg text-xs font-bold transition-all"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="inline-flex items-center text-text-muted text-xs font-medium px-4 py-1.5">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-success" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDrawConfirm}
        title="Run Official Draw?"
        message="This will irrevocably lock current entries, stop the active timer if running, generate the official winning 5 combinations for this cycle, and establish winner payouts."
        confirmText="Execute Draw"
        isDestructive={true}
        onConfirm={handleGenerateDraw}
        onCancel={() => setShowDrawConfirm(false)}
      />
    </div>
  );
};

export default AdminDraws;
