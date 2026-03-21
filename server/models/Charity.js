import mongoose from 'mongoose';

const charitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Charity = mongoose.model('Charity', charitySchema);

export default Charity;
