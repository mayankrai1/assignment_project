const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String, required: true },
  Permission: { type: String },
  name: { type: String },
  phone: { type: Number },
  type: { type: Number },
  dob: { type: Date },
  // position: { type: mongoose.Schema.Types.ObjectId, ref: 'user_role', required: false },

}, {
  versionKey: false,
  timestamps: true,
});



module.exports = mongoose.model('User', UserSchema);