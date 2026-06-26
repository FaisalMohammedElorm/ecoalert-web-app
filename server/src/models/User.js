import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    reportsCount: { type: Number, default: 0 },
    verifiedReportsCount: { type: Number, default: 0 },
    profilePictureUrl: { type: String, default: '' },
  },
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
