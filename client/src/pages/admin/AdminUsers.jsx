import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Shield, ShieldAlert, CreditCard, XCircle, Search } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">User Management</h1>
          <p className="text-text-muted">View, modify roles, and manage subscriptions.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:border-primary outline-none text-white text-sm"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold text-center">Plan Status</th>
                <th className="px-6 py-4 font-bold text-center">Charity</th>
                <th className="px-6 py-4 font-bold text-center">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                 <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted text-sm">No users found matching "{searchTerm}"</td>
                 </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-background/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-0.5">{user.name}</div>
                    <div className="text-xs text-text-muted">{user.email}</div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      user.isSubscribed ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                    }`}>
                      {user.isSubscribed ? `Active (${user.subscriptionType})` : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-white">
                      {user.charity || <span className="text-text-muted italic">None</span>}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                      user.isAdmin ? 'bg-primary/20 text-primary' : 'bg-border/50 text-text-muted'
                    }`}>
                      {user.isAdmin ? <Shield className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      <span>{user.isAdmin ? 'Admin' : 'User'}</span>
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

export default AdminUsers;
