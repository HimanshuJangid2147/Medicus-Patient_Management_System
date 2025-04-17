import MedicalRecord from "../models/medicalRecord.model.js";

export const createMedicalRecord = async (req, res) => {
    const { patientId, diagnosis, treatment, testResults, notes } = req.body;
    try {
        const newRecord = new MedicalRecord({
            patientId,
            doctorId: req.doctor._id, // Get doctor ID from authenticated user
            diagnosis,
            treatment,
            testResults,
            notes,
        });

        await newRecord.save();
        return res.status(201).json({
            message: "Medical record created successfully",
            record: newRecord,
        });
    } catch (error) {
        console.error("Error in createMedicalRecord controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find()
            .populate("patientId", "fullName email")
            .populate("doctorId", "name specialty");
        return res.status(200).json(records);
    } catch (error) {
        console.error("Error in getAllMedicalRecords controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getMedicalRecordById = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate("patientId", "fullName email")
            .populate("doctorId", "name specialty");

        if (!record) {
            return res.status(404).json({ message: "Medical record not found" });
        }

        // Check if user is the patient or the doctor
        const isPatient = req.user && record.patientId.equals(req.user._id);
        const isDoctor = req.doctor && record.doctorId.equals(req.doctor._id);

        if (!isPatient && !isDoctor) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        return res.status(200).json(record);
    } catch (error) {
        console.error("Error in getMedicalRecordById controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getMedicalRecordsByPatient = async (req, res) => {
    try {
        // If it's a patient, get their own records
        if (req.user) {
            const records = await MedicalRecord.find({ patientId: req.user._id })
                .populate("doctorId", "name specialty");
            return res.status(200).json(records);
        }
        // If it's a doctor viewing a specific patient's records, the route should be different
        return res.status(403).json({ message: "Unauthorized access" });
    } catch (error) {
        console.error("Error in getMedicalRecordsByPatient controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateMedicalRecord = async (req, res) => {
    try {
        const { diagnosis, treatment, testResults, notes } = req.body;
        const record = await MedicalRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Medical record not found" });
        }

        if (!record.doctorId.equals(req.doctor._id)) {
            return res.status(403).json({ message: "Only the recording doctor can update" });
        }

        record.diagnosis = diagnosis || record.diagnosis;
        record.treatment = treatment || record.treatment;
        record.testResults = testResults || record.testResults;
        record.notes = notes || record.notes;

        await record.save();
        return res.status(200).json({
            message: "Medical record updated successfully",
            record,
        });
    } catch (error) {
        console.error("Error in updateMedicalRecord controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteMedicalRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: "Medical record not found" });
        }

        if (!record.doctorId.equals(req.doctor._id)) {
            return res.status(403).json({ message: "Only the recording doctor can delete" });
        }

        await MedicalRecord.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Medical record deleted successfully" });
    } catch (error) {
        console.error("Error in deleteMedicalRecord controller", error);
        return res.status(500).json({ message: error.message });
    }
};