import Score from '../models/Score.js';
import User from '../models/User.js';
import TimerConfig from '../models/TimerConfig.js';
import Draw from '../models/Draw.js';

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

    const timer = await TimerConfig.findOne();
    if (!timer || !timer.isOpen) {
      res.status(403);
      throw new Error('Entries are currently closed.');
    }

    if (timer.endTime && new Date() > new Date(timer.endTime)) {
      timer.isOpen = false;
      await timer.save();
      res.status(403);
      throw new Error('Time is up! Entries are closed.');
    }

    // Wipe previous cycle scores if they are older than the latest draw
    const latestDraw = await Draw.findOne().sort({ createdAt: -1 });
    if (latestDraw) {
      const userScores = await Score.find({ userId: req.user._id });
      if (userScores.length > 0) {
        const maxScoreDate = new Date(Math.max(...userScores.map(s => new Date(s.createdAt).getTime())));
        if (new Date(latestDraw.createdAt) > maxScoreDate) {
          // The old scores belong to the prior draw cycle. Flush them to start fresh.
          await Score.deleteMany({ userId: req.user._id });
        }
      }
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
