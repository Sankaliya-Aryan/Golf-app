import mongoose from 'mongoose';

const timerConfigSchema = mongoose.Schema(
  {
    timeLimitMinutes: {
      type: Number,
      required: true,
      default: 2,
    },
    endTime: {
      type: Date,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TimerConfig = mongoose.model('TimerConfig', timerConfigSchema);

export default TimerConfig;
