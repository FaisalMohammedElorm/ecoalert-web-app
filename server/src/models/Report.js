import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, trim: true, default: 'Anonymous' },
    text: { type: String, required: [true, 'Comment text is required.'], trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    // ObjectId references connect this report document to the user document
    // that created it, similar to a foreign key in SQL.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: [true, 'Category is required.'], trim: true, maxlength: 60 },
    title: { type: String, trim: true, maxlength: 120, default: '' },
    description: { type: String, trim: true, maxlength: 1200, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
    coordinates: {
      latitude: { type: Number, min: -90, max: 90, default: 0 },
      longitude: { type: Number, min: -180, max: 180, default: 0 },
    },
    location: { type: String, trim: true, maxlength: 180, default: '' },
    status: { type: String, enum: ['pending', 'verified', 'resolved'], default: 'pending', index: true },
    verificationCount: { type: Number, min: 0, default: 0 },
    upvotes: { type: Number, min: 0, default: 0 },
    downvotes: { type: Number, min: 0, default: 0 },
    comments: { type: [commentSchema], default: [] },
  },
  // timestamps adds createdAt and updatedAt to every Report document.
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
