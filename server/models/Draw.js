import mongoose from 'mongoose';

const drawSchema = mongoose.Schema(
  {
    numbers: {
      type: [Number],
      required: true,
      validate: [
        function (val) {
          return val.length === 5;
        },
        '{PATH} must have exactly 5 numbers',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Draw = mongoose.model('Draw', drawSchema);

export default Draw;
