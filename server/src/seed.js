import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Report from './models/Report.js';

// Seeds a demo user and Accra sample reports so the app has data out of the box.
// Safe to re-run: it skips seeding if reports already exist.
const SEED_REPORTS = [
  { category: 'Plastic Waste', description: 'Large pile of mixed plastic waste blocking the drainage channel.', location: 'Kwame Nkrumah Avenue, Accra', status: 'pending', coordinates: { latitude: 5.56, longitude: -0.2057 } },
  { category: 'Mixed Waste', description: 'Illegal dumping site near the market. Organic and electronic waste mixed.', location: 'Osu, Accra', status: 'verified', coordinates: { latitude: 5.5557, longitude: -0.1837 } },
  { category: 'Hazardous Waste', description: 'Industrial chemical waste improperly disposed near residential area.', location: 'Tema, Greater Accra', status: 'resolved', coordinates: { latitude: 5.6698, longitude: -0.0166 } },
  { category: 'Road Hazard', description: 'Broken road with potholes causing traffic hazard and pooling waste water.', location: 'Madina, Accra', status: 'pending', coordinates: { latitude: 5.6804, longitude: -0.1648 } },
  { category: 'Organic Waste', description: 'Overflowing public rubbish bin, area smells and attracts pests.', location: 'Dansoman, Accra', status: 'verified', coordinates: { latitude: 5.5342, longitude: -0.2546 } },
];

async function run() {
  await connectDB(process.env.MONGODB_URI);

  const existing = await Report.countDocuments();
  if (existing > 0) {
    console.log(`Reports already exist (${existing}). Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  let demo = await User.findOne({ email: 'demo@ecoalert.app' });
  if (!demo) {
    demo = await User.create({
      name: 'EcoAlert Demo',
      email: 'demo@ecoalert.app',
      passwordHash: await bcrypt.hash('demo1234', 10),
      location: 'Accra, Ghana',
    });
  }

  await Report.insertMany(SEED_REPORTS.map((report) => ({ ...report, userId: demo._id })));
  console.log(`Seeded ${SEED_REPORTS.length} reports (owner: ${demo.email} / demo1234).`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
