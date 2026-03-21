import Score from '../models/Score.js';
import User from '../models/User.js';

// @desc    Add a score
// @route   POST /api/scores
// @access  Private
export const addScore = async (req, res, next) => {
  try {
    const { score } = req.body;

    if (!score || score < 1 || score > 45) {
      res.status(400);
      throw new Error('Score must be between 1 and 45');
    }

    const user = await User.findById(req.user._id);

    if (!user.isSubscribed) {
      res.status(403);
      throw new Error('Must be subscribed to add scores');
    }

    // Add new score
    const newScore = await Score.create({
      userId: req.user._id,
      score,
    });

    // Check how many scores the user has
    const userScores = await Score.find({ userId: req.user._id }).sort({
      createdAt: 1, // Ascending, oldest first
    });

    // If more than 5, delete oldest
    if (userScores.length > 5) {
      const scoresToDelete = userScores.slice(0, userScores.length - 5);
      const idsToDelete = scoresToDelete.map((s) => s._id);
      await Score.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(201).json(newScore);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's scores
// @route   GET /api/scores
// @access  Private
export const getMyScores = async (req, res, next) => {
  try {
    const scores = await Score.find({ userId: req.user._id }).sort({
      createdAt: -1, // Latest first
    });
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all scores
// @route   GET /api/scores/all
// @access  Private/Admin
export const getAllScores = async (req, res, next) => {
  try {
    const scores = await Score.find({}).populate('userId', 'name email');
    res.json(scores);
  } catch (error) {
    next(error);
  }
};
