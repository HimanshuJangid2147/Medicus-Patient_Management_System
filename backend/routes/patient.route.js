import express from "express";
import {
    createPatient,
    deletePatient,
    getAllPatients,
    getPatientById,
    getPatientsByUser,
    updatePatient,
    updatePatientById
} from "../controllers/patient.controller.js";
import {protectPatientRoute, protectRoute} from "../middleware/auth.middleware.js";
import upload from "../lib/upload.js";

const router = express.Router();

router.get("/user", protectPatientRoute, getPatientsByUser);
router.get("/all", getAllPatients);
router.post("/create", protectRoute, upload.single("identificationDocument"), createPatient);
router.get("/:id", protectPatientRoute, getPatientById);
router.put("/:id", protectPatientRoute, upload.single("identificationDocument"), updatePatient);
router.put("/update/:id", updatePatientById);
router.delete("/:id", protectPatientRoute, deletePatient);

export default router;