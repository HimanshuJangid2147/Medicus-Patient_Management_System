import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
  password: { type: String, required: true, minlength: 8 },
  phone: { type: String, match: /^\d{10}$/ },
  location: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  specialty: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  availability: { type: String, enum: ['Yes', 'No'], default: 'No' },
  workingHours: { type: String },
  consultationFee: { type: Number },
  experience: { type: Number },
  education: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: String }
  }],
  certifications: [{
    name: { type: String },
    issuedBy: { type: String },
    year: { type: String }
  }],
  otp: { type: String },
  otpExpires: { type: Date },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  }, { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;