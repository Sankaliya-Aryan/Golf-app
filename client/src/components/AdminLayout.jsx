import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Hash, Trophy, HeartHandshake, LineChart } from 'lucide-react';

const AdminLayout = () => {
  const links = [
    { to: '/admin', end: true, label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/admin/users', end: false, label: 'User Management', icon: <Users className="w-5 h-5" /> },
    { to: '/admin/scores', end: false, label: 'Recorded Scores', icon: <Hash className="w-5 h-5" /> },
    { to: '/admin/draws', end: false, label: 'Draws & Winners', icon: <Trophy className="w-5 h-5" /> },
    { to: '/admin/charities', end: false, label: 'Charities', icon: <HeartHandshake className="w-5 h-5" /> },
    { to: '/admin/analytics', end: false, label: 'Analytics', icon: <LineChart className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans flex flex-col md:flex-row gap-6 sm:gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-card rounded-2xl border border-border shadow-xl p-3 sm:p-4 sticky top-24">
          <h2 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4 px-2 hidden md:block">Admin Panel</h2>
          <nav className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 md:space-x-0 md:space-y-1 scrollbar-hide">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 md:space-x-3 px-3 py-2 md:py-3 rounded-xl transition-all font-bold whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-text-muted hover:bg-background hover:text-white border border-transparent'
                  }`
                }
              >
                {link.icon}
                <span className="text-sm md:text-base">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
