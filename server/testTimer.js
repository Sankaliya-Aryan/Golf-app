import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: 'd:\\Sem - 4\\GOLF NEW\\.env' });

const timerSchema = new mongoose.Schema(
  {
    timeLimitMinutes: { type: Number, required: true, default: 2 },
    endTime: { type: Date, default: null },
    isOpen: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const TimerConfig = mongoose.model('TimerConfig', timerSchema);

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        let timer = await TimerConfig.findOne();
        console.log("Timer config:", timer);

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
test();
