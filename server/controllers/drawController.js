import Draw from '../models/Draw.js';
import User from '../models/User.js';
import Score from '../models/Score.js';
import Winner from '../models/Winner.js';
import TimerConfig from '../models/TimerConfig.js';

// @desc    Generate a new draw
// @route   POST /api/draws
// @access  Private/Admin
export const generateDraw = async (req, res, next) => {
  try {
    // Generate 5 random unique numbers from 1 to 45
    const numbers = new Set();
    while (numbers.size < 5) {
      const randomNum = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNum);
    }

    const drawArray = Array.from(numbers).sort((a, b) => a - b);

    const draw = await Draw.create({
      numbers: drawArray,
    });

    // Evaluate Winners
    const allUsers = await User.find({});
    const winnersToInsert = [];

    for (const user of allUsers) {
      const userScores = await Score.find({ userId: user._id });
      if (userScores.length === 0) continue;

      const myNumbers = userScores.map((s) => s.score);
      const matchCount = myNumbers.filter((num) => drawArray.includes(num)).length;

      // Min 3 matches for a payout
      if (matchCount >= 3) {
        winnersToInsert.push({
          userId: user._id,
          drawId: draw._id,
          matchCount,
          status: 'Pending',
          prizeAmount: matchCount === 5 ? 5000 : matchCount === 4 ? 500 : 50,
        });
      }
    }

    if (winnersToInsert.length > 0) {
      await Winner.insertMany(winnersToInsert);
    }

    // Stop and close the timer securely whenever a draw officially occurs
    const timer = await TimerConfig.findOne();
    if (timer) {
      timer.isOpen = false;
      timer.endTime = null;
      await timer.save();
    }

    await User.updateMany({}, { isEntryLocked: false });

    res.status(201).json(draw);
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest draw
// @route   GET /api/draws/latest
// @access  Public
export const getLatestDraw = async (req, res, next) => {
  try {
    const draw = await Draw.findOne().sort({ createdAt: -1 });
    res.json(draw);
  } catch (error) {
    next(error);
  }
};

// @desc    Get draw history
// @route   GET /api/draws/history
// @access  Public
export const getDrawHistory = async (req, res, next) => {
  try {
    const draws = await Draw.find().sort({ createdAt: -1 });
    res.json(draws);
  } catch (error) {
    next(error);
  }
};

// @desc    Reopen entries for all users
// @route   PUT /api/draws/reopen
// @access  Private/Admin
export const reopenEntries = async (req, res, next) => {
  try {
    await User.updateMany({}, { isEntryLocked: false });
    res.json({ message: 'Entries reopened successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get timer configuration
// @route   GET /api/draws/timer
// @access  Public
export const getTimerConfig = async (req, res, next) => {
  try {
    let timer = await TimerConfig.findOne();
    if (!timer) {
      timer = await TimerConfig.create({ timeLimitMinutes: 2, isOpen: false });
    }
    res.json(timer);
  } catch (error) {
    next(error);
  }
};

// @desc    Update and Start/Stop timer
// @route   PUT /api/draws/timer
// @access  Private/Admin
export const updateTimerConfig = async (req, res, next) => {
  try {
    const { timeLimitMinutes, action } = req.body;
    let timer = await TimerConfig.findOne();
    if (!timer) timer = new TimerConfig();

    if (timeLimitMinutes) timer.timeLimitMinutes = timeLimitMinutes;

    if (action === 'start') {
      timer.endTime = new Date(Date.now() + timer.timeLimitMinutes * 60000);
      timer.isOpen = true;
    } else if (action === 'stop') {
      timer.isOpen = false;
      timer.endTime = null;
    }
    
    await timer.save();
    res.json(timer);
  } catch (error) {
    next(error);
  }
};
