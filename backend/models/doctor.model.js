import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  availability: [String],
});

export default mongoose.model('Doctor', doctorSchema);