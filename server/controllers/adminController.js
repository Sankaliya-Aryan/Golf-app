import User from '../models/User.js';
import Score from '../models/Score.js';
import Draw from '../models/Draw.js';
import Winner from '../models/Winner.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const activeSubscribers = await User.countDocuments({ isSubscribed: true });
    const totalScores = await Score.countDocuments({});
    const totalDraws = await Draw.countDocuments({});
    
    // Most selected charity
    const charityAggregation = await User.aggregate([
      { $match: { charity: { $ne: null, $ne: "" } } },
      { $group: { _id: "$charity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostSelectedCharity = charityAggregation.length > 0 ? charityAggregation[0]._id : "None yet";
    
    // Draw History
    const drawHistory = await Draw.find({}).sort({ createdAt: -1 }).limit(10);
    
    res.json({
      totalUsers,
      activeSubscribers,
      totalScores,
      totalDraws,
      mostSelectedCharity,
      drawHistory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all winners
// @route   GET /api/admin/winners
// @access  Private/Admin
export const getWinners = async (req, res, next) => {
  try {
    // Populate user and draw info
    const winners = await Winner.find({})
      .populate('userId', 'name email charity')
      .populate('drawId', 'numbers createdAt')
      .sort({ createdAt: -1 });
    res.json(winners);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve / Mark Winner as Paid
// @route   PUT /api/admin/winners/:id/pay
// @access  Private/Admin
export const markWinnerPaid = async (req, res, next) => {
  try {
    const winner = await Winner.findById(req.params.id);
    if (winner) {
      winner.status = 'Paid';
      const updatedWinner = await winner.save();
      res.json(updatedWinner);
    } else {
      res.status(404);
      throw new Error('Winner not found');
    }
  } catch (error) {
    next(error);
  }
};
