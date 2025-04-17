import Doctor from "../models/doctor.model.js";
import { generateToken } from "../lib/utils.js";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";

export const registerDoctor = async (req, res) => {
    const { name, username, email, password, confirmPassword, gender, specialty, image, bio, availability } = req.body;
    try {
        const existingDoctor = await Doctor.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email or username already exists" });
        }
        if (!name || !username || !email || !password || !confirmPassword || !gender || !specialty || !bio || !availability) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDoctor = new Doctor({
            name,
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            gender,
            specialty,
            image,
            bio,
            availability,
        });

        await newDoctor.save();
        generateToken(newDoctor._id, res);
        return res.status(201).json({
            _id: newDoctor._id,
            name: newDoctor.name,
            username: newDoctor.username,
            email: newDoctor.email,
            gender: newDoctor.gender,
            specialty: newDoctor.specialty,
            image: newDoctor.image,
            bio: newDoctor.bio,
            availability: newDoctor.availability,
        });
    } catch (error) {
        console.error("Error in registerDoctor controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const loginDoctor = async (req, res) => {
    const { email, password } = req.body;
    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateToken(doctor._id, res);
        return res.status(200).json({
            _id: doctor._id,
            name: doctor.name,
            username: doctor.username,
            email: doctor.email,
            gender: doctor.gender,
            specialty: doctor.specialty,
            image: doctor.image,
            bio: doctor.bio,
            availability: doctor.availability,
         });
    } catch (error) {
        console.error("Error in loginDoctor controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const logoutDoctor = (req, res) => {
    try {
        res.clearCookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logoutDoctor controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const checkDoctor = (req, res) => {
    try {
        return res.status(200).json(req.doctor);
    } catch (error) {
        console.error("Error in checkDoctor controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        // With multer middleware, form fields are in req.body and file is in req.file
        console.log("Request body received:", req.body);
        console.log("File received:", req.file);
        
        // Check if any data was provided
        if (!req.body && !req.file) {
            return res.status(400).json({ message: 'No update data provided' });
        }

        // Get form data
        const {
            name, username, email, gender, location, phone, specialty, bio,
            availability, consultationFee, experience, education, certifications, workingHours
        } = req.body;

        // Get doctor ID from the authenticated user
        const doctorId = req.doctor._id;

        // Validate required fields
        if (!name) return res.status(400).json({ message: 'Name is required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!specialty) return res.status(400).json({ message: 'Specialty is required' });

        // Validate formats
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone must be a 10-digit number' });
        }

        if (gender && !['male', 'female', 'other'].includes(gender)) {
            return res.status(400).json({ message: 'Invalid gender' });
        }

        if (availability && !['Yes', 'No'].includes(availability)) {
            return res.status(400).json({ message: 'Availability must be Yes or No' });
        }

        if (consultationFee && isNaN(Number(consultationFee))) {
            return res.status(400).json({ message: 'Consultation fee must be a number' });
        }

        if (experience && isNaN(Number(experience))) {
            return res.status(400).json({ message: 'Experience must be a number' });
        }

        // Build update data object
        const updateData = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (email) updateData.email = email.toLowerCase();
        if (gender) updateData.gender = gender;
        if (location) updateData.location = location;
        if (phone) updateData.phone = phone;
        if (specialty) updateData.specialty = specialty;
        if (bio) updateData.bio = bio;
        if (availability) updateData.availability = availability;
        if (consultationFee) updateData.consultationFee = Number(consultationFee);
        if (experience) updateData.experience = Number(experience);

        // Parse JSON strings if needed
        if (education) {
            try {
                updateData.education = typeof education === 'string' ? JSON.parse(education) : education;
            } catch (e) {
                console.error("Error parsing education:", e);
            }
        }
        
        if (certifications) {
            try {
                updateData.certifications = typeof certifications === 'string' ? JSON.parse(certifications) : certifications;
            } catch (e) {
                console.error("Error parsing certifications:", e);
            }
        }
        
        if (workingHours) {
            try {
                updateData.workingHours = typeof workingHours === 'string' ? JSON.parse(workingHours) : workingHours;
            } catch (e) {
                console.error("Error parsing workingHours:", e);
            }
        }

        // Handle file upload
        if (req.file) {
            // If using multer disk storage, the file path is available
            const filePath = req.file.path;
            console.log("File path:", filePath);
            
            // Upload to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(filePath, {
                folder: 'doctors',
            });
            updateData.image = uploadResponse.secure_url;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No data to update' });
        }

        // Check for unique constraints
        if (email) {
            const existingEmail = await Doctor.findOne({ email, _id: { $ne: doctorId } });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        if (username) {
            const existingUsername = await Doctor.findOne({ username, _id: { $ne: doctorId } });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already in use' });
            }
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -otp -otpExpires -resetToken -resetTokenExpires');

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({
            message: 'Doctor updated successfully',
            updatedDoctor,
        });
    } catch (error) {
        console.error('Error in updateDoctor controller:', error);
        if (error.code === 11000) {
            // Handle duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `${field} already in use` });
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        await Doctor.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error in deleteDoctorById controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        res.json({ availability: doctor.availability });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return res.json({ message: "If an Account with this email exists, you will receive an email with instructions to reset your password" });
        }

        const resetToken = randomBytes(32).toString("hex");
        doctor.resetToken = resetToken;
        doctor.resetTokenExpires = Date.now() + 3600000; // 1 hour
        await doctor.save();
        
        const resetLink = `${process.env.FRONTEND_URL}/doctor-reset-password/${resetToken}`;
        const mailOptions = {
            rom: `"Medicus" <${process.env.EMAIL_USER}>"`,
            to: email,
            subject: "Password Reset Request",
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0; background-color: #1a1a1a;">
    <!-- Header with background -->
    <div style="background-color: #2a2a2a; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <!-- Logo section -->
        <div style="margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dkjreh2ll/image/upload/v1744134727/Logoo_rxxq4g.svg" 
                 alt="Medicus Logo" 
                 width="120" 
                 height="120" 
                 style="display: block; margin: 0 auto;">
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Medicus</h1>
    </div>

    <!-- Content Container -->
    <div style="background-color: #2a2a2a; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%;">
            <tr>
                <td style="padding: 0;">
                    <h2 style="color: #4a90e2; text-align: center; margin: 0 0 30px 0; font-size: 26px; font-weight: 600;">Reset Your Password</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; color: #b0b0b0;">Hi there,</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #b0b0b0;">
                        We received a request to reset your password for your Medicus account. If you made this request, please click the button below to reset your password.
                    </p>

                    <!-- Button Container -->
                    <div style="text-align: center; margin: 35px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center">
                                    <table cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="border-radius: 50px; background-color: #4a90e2; box-shadow: 0 4px 8px rgba(74,144,226,0.3);">
                                                <a href="${resetLink}" 
                                                   target="_blank"
                                                   style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #333333; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: center; color: #b0b0b0;">
                            Or copy and paste this link into your browser:
                        </p>
                        <p style="font-size: 14px; line-height: 1.6; margin: 0; text-align: center; word-break: break-all;">
                            <a href="${resetLink}" style="color: #4a90e2; text-decoration: underline;">${resetLink}</a>
                        </p>
                    </div>

                    <div style="background-color: #2d2d2d; border-left: 4px solid #e94a4a; padding: 15px; margin: 25px 0;">
                        <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #b0b0b0;">
                            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                        </p>
                    </div>

                    <hr style="border: none; border-top: 1px solid #444444; margin: 30px 0;">

                    <!-- Footer -->
                    <div style="text-align: center; background-color: #333333; padding: 20px; border-radius: 8px;">
                        <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #b0b0b0;">
                            Need help? Contact our support team at
                            <a href="mailto:support@carepulse.com" style="color: #4a90e2; text-decoration: none; font-weight: 600;">medicus.app@outlook.com</a>
                        </p>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    
    <!-- Footer Branding -->
    <div style="text-align: center; padding: 20px;">
        <p style="font-size: 12px; color: #999999; margin: 0;">
            © 2025 CarePulse. All rights reserved.
        </p>
    </div>
</div> 
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Password Reset Link Sucessfully Sent to:', email);

            res.status(200).json({
                message: 'If an account exists with the provided email, a password reset link has been sent to the email.',
            });
        } catch (error) {
            console.log('Error sending password reset link:', error);
            doctor.resetToken = undefined;
            doctor.resetTokenExpires = undefined;

            res.status(500).json({
                error: 'Error sending password reset link, please try again Later.',
            });
        }
    } catch (error) {
        console.error('Password Reset Error:', error);
        res.status(500).json({
            error: 'An unexpected error occurred while processing your request. Please try again later.',
        });
    }
};
            
export const verifyResetToken = async (req, res) => {
    try {
        const { resetToken } = req.params;

        if (!resetToken) {
            console.error("No Token is Provided in Request.")
            return res.status(400).json({
                success: false,
                error: 'Reset token is required.',
                valid: false, 
            });
        }

        // Find the doctor with this token and check if it's not expired
        const doctor = await Doctor.findOne({ 
            resetToken,
            resetTokenExpires: { $gt: Date.now() }
        });
         
        if (!doctor) {
            return res.status(400).json({
                success: false,
                error: "Invalid or expired reset token",
                valid: false,
            });
        }

        res.json({
            success: true,
            message: 'Reset token is valid.',
            valid: true,
            email: doctor.email,
        });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred while processing your request.',
            valid: false,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if(!resetToken || !newPassword){
            return res.status(400).json({
                success: false,
                error: 'Reset token and new password are required.',
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 8 characters long",
            });
        }

        const doctor = await Doctor.findOne({
            resetToken: resetToken,
            resetTokenExpires: { $gt: Date.now() },
        });

        if(!doctor){
            return res.status(400).json({
                success: false,
                error: "Invalid or expired reset token",
            });
        }

        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset token fields
        doctor.resetToken = undefined;
        doctor.resetTokenExpires = undefined;

        await doctor.save();

        res.json({
            success: true,
            message: 'Password reset successfully.',
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            error: "Failed to reset password",
        });
    }
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        doctor.otp = otp; // Store OTP in user model
        doctor.otpExpires = Date.now() + 300000; // 5-minute expiry
        await doctor.save();

        // Send OTP via email
        const mailOptions = {
            from: `"Medicus" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP for Login",
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0; background-color: #1a1a1a;">
          <div style="background-color: #2a2a2a; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="margin-bottom: 20px;">
              <img src="https://res.cloudinary.com/dkjreh2ll/image/upload/v1744134727/Logoo_rxxq4g.svg" alt="Medicus Logo" width="120" height="120" style="display: block; margin: 0 auto;">
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Medicus</h1>
          </div>
          <div style="background-color: #2a2a2a; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
            <h2 style="color: #4a90e2; text-align: center; margin: 0 0 30px 0; font-size: 26px; font-weight: 600;">Your OTP Code</h2>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; color: #b0b0b0;">Hi ${doctor.name},</p>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; color: #b0b0b0;">
              Your One-Time Password (OTP) for login is: <strong>${otp}</strong>. This OTP is valid for 5 minutes.
            </p>
            <div style="background-color: #2d2d2d; border-left: 4px solid #e94a4a; padding: 15px; margin: 25px 0;">
              <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #b0b0b0;">
                If you didn't request this OTP, please ignore this email or contact support.
              </p>
            </div>
            <div style="text-align: center; background-color: #333333; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #b0b0b0;">
                Need help? Contact us at <a href="mailto:medicus.app@outlook.com" style="color: #4a90e2; text-decoration: none; font-weight: 600;">medicus.app@outlook.com</a>
              </p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px;">
            <p style="font-size: 12px; color: #999999; margin: 0;">
              © 2025 CarePulse. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully to:", email);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const doctor = await Doctor.findOne({ email });
        if (!doctor || doctor.otp !== otp || doctor.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        doctor.otp = undefined;
        doctor.otpExpires = undefined;
        await doctor.save();

        generateToken(doctor._id, res);
        res.status(200).json({
            message: "OTP verified successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                username: doctor.username,
                email: doctor.email,
                gender: doctor.gender,
                specialty: doctor.specialty,
                image: doctor.image,
                bio: doctor.bio,
                availability: doctor.availability,
            },
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
};