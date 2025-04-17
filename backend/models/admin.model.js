import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, match: /^\d{10}$/ },
    gender: { type: String, enum: ["male", "female"] },
    Image: { type: String },
    }, { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;