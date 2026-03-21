import User from '../models/User.js';

// @desc    Subscribe user
// @route   POST /api/users/subscribe
// @access  Private
export const subscribeUser = async (req, res, next) => {
  try {
    const { plan } = req.body;
    
    if (plan !== 'monthly' && plan !== 'yearly') {
      res.status(400);
      throw new Error('Invalid plan type');
    }

    const user = await User.findById(req.user._id);

    if (user) {
      if (user.isSubscribed && new Date() < new Date(user.subscriptionEndDate)) {
        res.status(400);
        throw new Error('You already have an active subscription');
      }

      user.isSubscribed = true;
      user.subscriptionType = plan;
      
      const startDate = new Date();
      user.subscriptionStartDate = startDate;
      
      const endDate = new Date(startDate);
      if (plan === 'monthly') {
        endDate.setDate(endDate.getDate() + 30);
      } else if (plan === 'yearly') {
        endDate.setDate(endDate.getDate() + 365);
      }
      user.subscriptionEndDate = endDate;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        isSubscribed: updatedUser.isSubscribed,
        subscriptionType: updatedUser.subscriptionType,
        subscriptionEndDate: updatedUser.subscriptionEndDate,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel subscription
// @route   PUT /api/users/cancel
// @access  Private
export const cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isSubscribed = false;
      user.subscriptionType = 'none';
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        isSubscribed: updatedUser.isSubscribed,
        subscriptionType: updatedUser.subscriptionType,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscription status
// @route   GET /api/users/subscription
// @access  Private
export const getSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      let daysRemaining = 0;
      if (user.isSubscribed && user.subscriptionEndDate) {
        const diffTime = Math.abs(new Date(user.subscriptionEndDate) - new Date());
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      res.json({
        status: user.isSubscribed ? 'Active' : 'Expired',
        plan: user.subscriptionType,
        expiry: user.subscriptionEndDate,
        daysRemaining: user.isSubscribed ? daysRemaining : 0,
        isEntryLocked: user.isEntryLocked || false,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update charity
// @route   PUT /api/users/charity
// @access  Private
export const updateCharity = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.charity = req.body.charity || user.charity;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        charity: updatedUser.charity,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin toggle subscription
// @route   PUT /api/users/:id/subscribe
// @access  Private/Admin
export const adminToggleSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    if (user.isSubscribed) {
       user.isSubscribed = false;
       user.subscriptionType = 'none';
    } else {
       user.isSubscribed = true;
       user.subscriptionType = 'monthly';
       const startDate = new Date();
       const endDate = new Date(startDate);
       endDate.setDate(endDate.getDate() + 30);
       user.subscriptionStartDate = startDate;
       user.subscriptionEndDate = endDate;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) { 
    next(error); 
  }
};

// @desc    Admin toggle role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const adminToggleRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    user.isAdmin = !user.isAdmin;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch(error) { 
    next(error); 
  }
};
