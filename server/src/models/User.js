import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80, default: '' },
    // `unique` creates a MongoDB index; it is not a validator by itself, so the
    // controller still checks for an existing email to return a friendly error.
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
    },
    // select:false keeps the hash out of normal queries. Login opts in with
    // .select('+passwordHash') only when comparing passwords with bcrypt.
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    reportsCount: { type: Number, min: 0, default: 0 },
    verifiedReportsCount: { type: Number, min: 0, default: 0 },
    profilePictureUrl: { type: String, trim: true, default: '' },
  },
  // timestamps adds createdAt and updatedAt to every User document.
  { timestamps: true }
);

// Shape returned to the client. Exposes both `id` and `uid` (same value) so
// older frontend code keeps working unchanged.
userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id.toString(),
    uid: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    location: this.location,
    role: this.role,
    reportsCount: this.reportsCount,
    verifiedReportsCount: this.verifiedReportsCount,
    profilePictureUrl: this.profilePictureUrl,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model('User', userSchema);
