import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER'],
    default: 'ROLE_USER',
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
