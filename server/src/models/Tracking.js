import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema(
  {
    // Each tracking entry belongs to one user. The index keeps "my tracking"
    // queries fast as the collection grows.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: [true, 'Category is required.'], trim: true, maxlength: 60 },
    quantity: { type: Number, min: 0, default: 0 },
    weight: { type: Number, min: 0, default: 0 },
    unit: { type: String, trim: true, maxlength: 20, default: 'kg' },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
    date: { type: Date, default: Date.now },
  },
  // timestamps adds createdAt and updatedAt to every Tracking document.
  { timestamps: true }
);

export default mongoose.model('Tracking', trackingSchema);
