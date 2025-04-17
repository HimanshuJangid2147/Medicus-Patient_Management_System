import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: false,
    },
    name: { type: String, required: true, trim: true, maxlenght: 50 },
    email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
    password: { type: String, required: true, minlenght: 8 },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    profileImage: { type: String },
    address: { street: String, city: String, state: String, zip: String, country: String },
    phone: { type: String, match: /^\d{10}$/ },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    otp: { type: String },
    otpExpires: { type: Date },
    }, { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;