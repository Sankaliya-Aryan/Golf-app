import Draw from '../models/Draw.js';
import User from '../models/User.js';
import Score from '../models/Score.js';
import Winner from '../models/Winner.js';

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
