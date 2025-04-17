import Admin from "../models/admin.model.js";
import { generateToken } from "../lib/utils.js";
import bcryptjs from "bcryptjs";

export const registerAdmin = async (req, res) => {
    
    const { name, email, password, confirmPassword, gender } = req.body;
        try {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: "User Already Exists" })
            }
            if (!name || !email || !password || !confirmPassword || !gender) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (password.length < 8) {
                return res
                  .status(400)
                  .json({ message: "Password must be at least 8 characters long" });
              }
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
              }

            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);

            const newAdmin = new Admin({ name, email, password: hashedPassword, confirmPassword, gender });

            if (newAdmin) {
                generateToken(newAdmin._id, res);
                await newAdmin.save();
                return res.status(201).json({
                    _id: newAdmin._id,
                    name: newAdmin.name,
                    email: newAdmin.email,
                    gender: newAdmin.gender,
                });
            } else {
              return res.status(400).json({ message: "User not created" });
            }
        } catch (error) {
            console.error("Error in registerAdmin controller", error);
            return res.status(500).json({ message: error.message });
        }
};

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateToken(admin._id, res);
        return res.status(200).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            gender: admin.gender,
         });
    } catch (error) {
        console.error("Error in loginAdmin controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const logoutAdmin = (req, res) => {
    try {
        res.clearCookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logoutAdmin controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const checkAdmin = (req, res) => {
    try {
        return res.status(200).json(req.admin);
    } catch (error) {
        console.error("Error in checkAdmin controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const { name, email, phone, gender } = req.body;
        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.phone = phone || admin.phone;
        admin.gender = gender || admin.gender;

        await admin.save();
        return res.status(200).json({
            message: "Admin updated successfully",
            admin: { _id: admin._id, name: admin.name, email: admin.email },
        });
    } catch (error) {
        console.error("Error in updateAdmin controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        await Admin.deleteOne({ _id: req.admin._id });
        res.clearCookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Error in deleteAdmin controller", error);
        return res.status(500).json({ message: error.message });
    }
};