// models/patient.model.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor", // Reference to the Doctor model
        required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "male", "female", "Other"], required: true },
    address: { type: String },
    occupation: { type: String },
    emergencyContactName: { type: String },
    emergencyPhoneNumber: { type: String },
    primaryPhysician: { type: String, default: "Dr. Adam Smith" },
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    allergies: { type: String },
    currentMedications: { type: String },
    familyMedicalHistory: { type: String },
    pastMedicalHistory: { type: String },
    identificationType: { type: String, enum: ["Birth Certificate", "Driver's License", "Passport", "Aadhar Card"], default: "Birth Certificate" },
    identificationNumber: { type: String },
    // For file upload (to be implemented with Cloudinary)
    identificationDocument: { type: String }, // URL or path to uploaded file
    consentTreatment: { type: Boolean, default: true },
    consentDisclosure: { type: Boolean, default: false },
    privacyPolicy: { type: Boolean, default: true },
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;