import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI is not set');
  mongoose.set('strictQuery', true);
  // Mongoose manages the connection pool for us. The same function works for
  // MongoDB Atlas (`mongodb+srv://...`) and a local development URI.
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}
