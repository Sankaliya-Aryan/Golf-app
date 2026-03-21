import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trophy, PlayCircle, Dices, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const AdminDraws = () => {
  const [latestDraw, setLatestDraw] = useState(null);
  const [winners, setWinners] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchLatestDraw();
    fetchWinners();
  }, []);

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
    if(!window.confirm('WARNING: Running a new draw will permanently calculate new winners against all current scores. Proceed?')) return;
    setIsGenerating(true);
    try {
      const { data } = await api.post('/draws');
      toast.success('Draw generated successfully!');
      setLatestDraw(data);
      fetchWinners();
    } catch (error) {
      toast.error('Failed to generate draw');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateDraw = () => {
    const numbers = new Set();
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const drawArray = Array.from(numbers).sort((a, b) => a - b);
    
    toast.success(`Mock Simulation: [${drawArray.join(', ')}]`, {
      duration: 5000,
      icon: '🎰',
      style: { background: '#111827', color: '#F9FAFB', border: '1px solid #6366F1' }
    });
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
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleSimulateDraw}
            disabled={isGenerating}
            className="flex-1 sm:flex-none py-2 px-4 bg-card border border-primary text-primary hover:bg-primary/10 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Dices className="w-4 h-4" />
            <span>Simulate</span>
          </button>
          <button
            onClick={handleGenerateDraw}
            disabled={isGenerating}
            className="flex-1 sm:flex-none py-2 px-6 bg-gradient-to-r from-danger to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg shadow-danger/25 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
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
                <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2 border-border bg-background shadow-inner text-white">
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
    </div>
  );
};

export default AdminDraws;
