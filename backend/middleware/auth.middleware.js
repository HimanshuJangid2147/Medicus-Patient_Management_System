import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authorized, Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    return res.status(500).json({ message: "Authentication failed due to server error" });
  }
};

export const protectAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authorized, Invalid Token" });
    }

    const admin = await Admin.findById(decoded.userId).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Not authorized, Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Error in protectAdminRoute middleware", error);
    return res.status(500).json({ message: "Authentication failed due to server error" });
  }
};

export const protectDoctorRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authorized, Invalid Token" });
    }

    const doctor = await Doctor.findById(decoded.userId).select("-password");
    if (!doctor) {
      return res.status(401).json({ message: "Not authorized, Doctor not found" });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("Error in protectDoctorRoute middleware", error);
    return res.status(500).json({ message: "Authentication failed due to server error" });
  }
};

export const protectPatientRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authorized, Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, User not found" });
    }

    const patient = await Patient.findOne({ userId: user._id });
    if (!patient || (req.params.id && patient._id.toString() !== req.params.id)) {
      return res.status(403).json({ message: "Not authorized to access this patient record" });
    }

    req.user = user;
    req.patient = patient; // Add patient to request for further use
    next();
  } catch (error) {
    console.error("Error in protectPatientRoute middleware", error);
    return res.status(500).json({ message: "Authentication failed due to server error" });
  }
};

export const protectMultiRoleRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authorized, Invalid Token" });
    }

    // First check if this is an admin
    const admin = await Admin.findById(decoded.userId).select("-password");
    if (admin) {
      req.admin = admin;
      console.log("Admin authenticated:", admin._id);
      return next();
    }

    // Next check if this is a doctor
    const doctor = await Doctor.findById(decoded.userId).select("-password");
    if (doctor) {
      req.doctor = doctor;
      console.log("Doctor authenticated:", doctor._id);
      return next();
    }

    // Finally, check if this is a regular user
    const user = await User.findById(decoded.userId).select("-password");
    if (user) {
      req.user = user;
      console.log("User authenticated:", user._id);
      return next();
    }

    // If we got here, the user ID doesn't match any valid user type
    return res.status(401).json({ message: "Not authorized, User not found" });
  } catch (error) {
    console.error("Error in protectMultiRoleRoute middleware:", error);
    return res.status(500).json({ message: "Authentication failed due to server error" });
  }
};