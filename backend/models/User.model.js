import mongoose from 'mongoose';

/**
 * User identity — credentials never returned to clients (passwordHash select:false).
 * FUTURE: SSO, organizations, API keys, MFA.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    /** Bcrypt hash — not plaintext `password` */
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['researcher', 'admin'],
      default: 'researcher',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
