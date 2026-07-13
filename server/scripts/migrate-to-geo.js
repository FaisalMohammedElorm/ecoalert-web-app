import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Report from '../src/models/Report.js';
import { connectDB } from '../src/config/db.js';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!uri) {
    console.error('Please set MONGODB_URI in your environment.');
    process.exit(2);
  }

  try {
    await connectDB(uri);

    // Ensure index exists
    console.log('Creating 2dsphere index on `geo`...');
    await Report.collection.createIndex({ geo: '2dsphere' });

    // Find reports that do not have a geo field but have legacy coordinates
    const cursor = Report.find({
      geo: { $in: [null, undefined] },
      $or: [ { 'coordinates.latitude': { $exists: true } }, { 'coordinates.longitude': { $exists: true } } ],
    }).cursor();

    let count = 0;
    for await (const doc of cursor) {
      const lat = doc.coordinates?.latitude;
      const lng = doc.coordinates?.longitude;
      if (typeof lat === 'number' && typeof lng === 'number') {
        doc.geo = { type: 'Point', coordinates: [lng, lat] };
        await doc.save();
        count += 1;
      }
    }

    console.log(`Migration complete. Updated ${count} documents.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
