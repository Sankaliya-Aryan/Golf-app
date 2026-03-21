import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, HeartHandshake } from 'lucide-react';
import api from '../../services/api';

const AdminCharities = () => {
  const [charities, setCharities] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const { data } = await api.get('/charities');
      setCharities(data);
    } catch (error) {
      toast.error('Failed to load charities');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/charities/${editingId}`, formData);
        toast.success('Charity updated');
      } else {
        await api.post('/charities', formData);
        toast.success('Charity added');
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchCharities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save charity');
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setFormData({ name: c.name, description: c.description });
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this charity?')) return;
    try {
      await api.delete(`/charities/${id}`);
      toast.success('Charity deleted');
      fetchCharities();
    } catch (error) {
      toast.error('Failed to delete charity');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Charity Management</h1>
          <p className="text-text-muted">Manage the organizations users can donate their winnings to.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            {editingId ? 'Edit Charity' : 'Add New Charity'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Charity Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                placeholder="WWF, Red Cross..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white resize-none"
                placeholder="Brief mission statement..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-primary hover:bg-primary-hover border border-primary text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{editingId ? 'Save Changes' : 'Create Charity'}</span>
              </button>
              {editingId && (
                <button
                   type="button"
                   onClick={() => { setEditingId(null); setFormData({name:'', description:''}); }}
                   className="px-4 py-3 bg-background hover:bg-border/50 text-text border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          {charities.length === 0 ? (
             <div className="p-10 border-2 border-dashed border-border rounded-2xl text-center bg-card/50 flex flex-col items-center">
                <HeartHandshake className="w-12 h-12 text-border mb-3" />
                <h3 className="text-lg font-bold text-white">No Charities Currently</h3>
                <p className="text-text-muted text-sm">Add your first approved charity organization on the left.</p>
              </div>
           ) : charities.map(c => (
              <div key={c._id} className="bg-card p-4 sm:p-5 rounded-2xl border border-border hover:border-primary/30 transition-all flex flex-col sm:flex-row justify-between gap-4 shadow-lg group">
                 <div>
                   <h3 className="text-lg font-bold text-white mb-1">{c.name}</h3>
                   <p className="text-text-muted text-sm leading-relaxed">{c.description}</p>
                </div>
                <div className="flex sm:flex-col justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => handleEdit(c)} className="p-2 border border-border hover:border-blue-500 hover:text-blue-500 rounded-lg bg-background transition-colors" title="Edit">
                     <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="p-2 border border-border hover:border-danger hover:text-danger rounded-lg bg-background transition-colors" title="Delete">
                     <Trash2 className="w-4 h-4" />
                  </button>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCharities;
