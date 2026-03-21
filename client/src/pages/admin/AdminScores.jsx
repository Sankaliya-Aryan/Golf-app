import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Hash, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminScores = () => {
  const [scores, setScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const { data } = await api.get('/scores/all');
      setScores(data);
    } catch (error) {
      toast.error('Failed to load global scores');
    }
  };

  const filteredScores = scores.filter(s => 
    s.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.score.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Global Scores</h1>
          <p className="text-text-muted">A complete history of every score entered by active users.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search golfer or score..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:border-primary outline-none text-white text-sm"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-background/50 border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Player Name</th>
                <th className="px-6 py-4 font-bold text-center">Score Recorded</th>
                <th className="px-6 py-4 font-bold text-right flex items-center justify-end space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date Tracked</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredScores.length === 0 ? (
                 <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-text-muted text-sm border-t border-border">No scores found matching "{searchTerm}"</td>
                 </tr>
              ) : filteredScores.map((score) => (
                <tr key={score._id} className="hover:bg-background/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                        {score.userId?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span>{score.userId?.name || 'Unknown User'}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center space-x-1 font-black text-xl text-white group-hover:text-primary transition-colors">
                      <Hash className="w-4 h-4 text-primary opacity-50" />
                      <span>{score.score}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 bg-background border border-border rounded-lg text-xs font-medium text-text-muted inline-block">
                      {new Date(score.createdAt).toLocaleString(undefined, { 
                        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminScores;
