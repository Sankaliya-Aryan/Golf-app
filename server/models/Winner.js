import mongoose from 'mongoose';

const winnerSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Draw',
    },
    matchCount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    prizeAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Winner = mongoose.model('Winner', winnerSchema);

export default Winner;
