import Patient from "../models/patient.model.js";
import cloudinary from "cloudinary";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";

export const createPatient = async (req, res) => {
    try {
        // Basic validation
        const { fullName, doctorId, email, phoneNumber } = req.body;
        
        if (!fullName || !email) {
            return res.status(400).json({ message: "Full name and email are required fields" });
        }
        
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Get the current logged-in user ID from the request
        const userId = req.user._id;

        // Create new patient with all fields from req.body
        const newPatient = new Patient({
            userId, // Use the ID from the logged-in user
            doctorId, // Use the doctor ID from the form data
            ...req.body
        });

        const savedPatient = await newPatient.save();
        
        // Add this patient to the user's patients array
        if (userId) {
            await User.findByIdAndUpdate(
                userId, 
                { $addToSet: { patients: savedPatient._id } }
            );
        }
        
        // Only add this patient to the doctor's patients array if doctorId is provided
        if (doctorId) {
            await Doctor.findByIdAndUpdate(
                doctorId, 
                { $addToSet: { patients: savedPatient._id } }
            );
        }
        
        return res.status(201).json({
            message: "Patient created successfully",
            patient: savedPatient, // Return full patient object
        });
    } catch (error) {
        console.error("Error in createPatient controller", error);
        
        // Handle duplicate key errors specifically
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: "A patient with this email already exists" 
            });
        }
        
        return res.status(500).json({ message: error.message });
    }
};

// Helper function for email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


export const getPatientsByUser = async (req, res) => {
    try {
        const patients = await Patient.find({ userId: req.user._id });
        return res.status(200).json(patients);
    } catch (error) {
        console.error("Error in getPatientsByUser controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json(patient);
    } catch (error) {
        console.error("Error in getPatientById controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const {
            fullName, email, phoneNumber, dateOfBirth, gender, address, occupation, emergencyContactName, emergencyPhoneNumber, primaryPhysician, insuranceProvider, insurancePolicyNumber, allergies, currentMedications, familyMedicalHistory, pastMedicalHistory, identificationType, identificationNumber, consentTreatment, consentDisclosure, privacyPolicy
        } = req.body;
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        patient.fullName = fullName || patient.fullName;
        patient.email = email || patient.email;
        patient.phoneNumber = phoneNumber || patient.phoneNumber;
        patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
        patient.gender = gender || patient.gender;
        patient.address = address || patient.address;
        patient.occupation = occupation || patient.occupation;
        patient.emergencyContactName = emergencyContactName || patient.emergencyContactName;
        patient.emergencyPhoneNumber = emergencyPhoneNumber || patient.emergencyPhoneNumber;
        patient.primaryPhysician = primaryPhysician || patient.primaryPhysician;
        patient.insuranceProvider = insuranceProvider || patient.insuranceProvider;
        patient.insurancePolicyNumber = insurancePolicyNumber || patient.insurancePolicyNumber;
        patient.allergies = allergies || patient.allergies;
        patient.currentMedications = currentMedications || patient.currentMedications;
        patient.familyMedicalHistory = familyMedicalHistory || patient.familyMedicalHistory;
        patient.pastMedicalHistory = pastMedicalHistory || patient.pastMedicalHistory;
        patient.identificationType = identificationType || patient.identificationType;
        patient.identificationNumber = identificationNumber || patient.identificationNumber;
        patient.consentTreatment = consentTreatment || patient.consentTreatment;
        patient.consentDisclosure = consentDisclosure || patient.consentDisclosure;
        patient.privacyPolicy = privacyPolicy || patient.privacyPolicy;

        await patient.save();
        return res.status(200).json({
            message: "Patient updated successfully",
            patient,
        });
    } catch (error) {
        console.error("Error in updatePatient controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updatePatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        if (patient.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized to update this patient" });
        }
        const {
            fullName, email, phoneNumber, dateOfBirth, gender
        } = req.body;
        patient.fullName = fullName || patient.fullName;
        patient.email = email || patient.email;
        patient.phoneNumber = phoneNumber || patient.phoneNumber;
        patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
        patient.gender = gender || patient.gender;

        await patient.save();
        return res.status(200).json({
            message: "Patient updated successfully",
            patient,
        });
    } catch (error) {
        console.error("Error in updatePatientById controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        if (patient.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized to delete this patient" });
        }

        await Patient.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        console.error("Error in deletePatient controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        return res.status(200).json(patients);
    } catch (error) {
        console.error("Error in getAllPatients controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getPatientByDoctor = async (req, res) => {
    try {
        const patients = await Patient.find({ doctorId: req.params.id });
        return res.status(200).json(patients);
    } catch (error) {
        console.error("Error in getPatientByDoctor controller", error);
        return res.status(500).json({ message: error.message });
    }
};

