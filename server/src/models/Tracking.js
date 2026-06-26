import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' },
    notes: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Tracking', trackingSchema);
