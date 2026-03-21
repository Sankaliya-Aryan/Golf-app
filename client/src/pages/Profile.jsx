import { useContext } from 'react';
import { User as UserIcon, Mail, Heart, CreditCard, Activity } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-blue-600"></div>
        <div className="px-5 sm:px-8 pb-8 flex flex-col items-center -mt-16">
          <div className="h-32 w-32 rounded-full bg-card border-4 border-background flex items-center justify-center text-primary mb-4 shadow-lg">
            <UserIcon className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-text-muted flex items-center mt-2">
            <Mail className="w-4 h-4 mr-2" />
            {user.email}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <CreditCard className="w-8 h-8 mx-auto text-primary mb-3" />
              <h3 className="text-text-muted text-sm font-medium">Subscription</h3>
              <p className={`font-bold mt-1 ${user.isSubscribed ? 'text-success' : 'text-danger'}`}>
                {user.isSubscribed ? 'Active' : 'Inactive'}
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <Heart className="w-8 h-8 mx-auto text-success mb-3" />
              <h3 className="text-text-muted text-sm font-medium">Supported Charity</h3>
              <p className="font-bold mt-1 text-white">
                {user.charity || 'Not selected'}
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <Activity className="w-8 h-8 mx-auto text-blue-500 mb-3" />
              <h3 className="text-text-muted text-sm font-medium">Role</h3>
              <p className="font-bold mt-1 text-white">
                {user.isAdmin ? 'Admin' : 'Player'}
              </p>
            </div>
          </div>

          <div className="mt-10 flex gap-4 w-full justify-center">
            <Link to="/dashboard" className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
              Manage in Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
