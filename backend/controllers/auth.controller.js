import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import { randomBytes } from "crypto";
import bcryptjs from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";

export const signup = async (req, res) => {
  const { name, email, password, confirmPassword, gender } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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

    const newUser = new User({ name, email, password: hashedPassword, confirmPassword, gender });


    if (newUser) {
        generateToken(newUser._id, res);
        await newUser.save();
        return res.status(201).json({ 
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            gender: newUser.gender,
        });
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.error("Error in signup controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    return res.status(200).json({ 
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
     });
  } catch (error) {
    console.error("Error in login controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, gender, profileImage, address, phone } = req.body;
        const userId = req.user._id;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (gender) updateData.gender = gender;
        if (address) updateData.address = address;
        if (phone) updateData.phone = phone;

        if (profileImage) {
            const uploadResponse = await cloudinary.uploader.upload(profileImage);
            updateData.profileImage = uploadResponse.secure_url;
        }

        if ( Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select("-password");

        res.status(200).json({
            message: "User updated successfully",
            updatedUser,
        });
    } catch (error) {
        console.error("Error in updateUser controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller", error);
        return res.status(500).json({ message: error.message });
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

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: "If an Account with this email exists, you will receive an email with instructions to reset your password" });
        }

        const resetToken = randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
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
            })
        } catch (error) {
            console.log('Error sending password reset link:', error);
            user.resetToken = undefined;
            user.resetTokenExpires = undefined;

            res.status(500).json({
                error: 'Error sending password reset link, please try again Later.',
            });
        }
    } catch (error) {
        console.error('Password Reset Error:',error);
        res.status(500).json({
            error: 'An unexpected error occurred while processing your request. Please try again later.',
        });
    }
};
            
export const verifyResetToken = async (req, res) => {
    try {
        const { resetToken } = req.params;

        if(!resetToken){
            console.error("No Token is Provided in Request.")
            return res.status(400).json({
                success: false,
                error: 'Reset token is required.',
                valid: false, 
            });
        }

        // Log the token for debugging
        console.log("Attempting to verify token:", resetToken);
        
        // First try to find any user with this token, regardless of expiration
        const anyUserWithToken = await User.findOne({ resetToken });
        console.log("Any user with this token (ignoring expiration):", anyUserWithToken ? "Yes" : "No");
        
        if (anyUserWithToken) {
            console.log("Token in DB:", anyUserWithToken.resetToken);
            console.log("Token Expires at:", new Date(anyUserWithToken.resetTokenExpires));
            console.log("Current time:", new Date());
            console.log("Token Expired:", anyUserWithToken.resetTokenExpires < Date.now());
        }

        // Now do the actual query with expiration check
        const user = await User.findOne({ 
            resetToken: resetToken,
            resetTokenExpires: { $gt: Date.now() }
        });
         
        console.log("Valid user found:", user ? "Yes" : "No");
         
        if (!user) {
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
            email: user.email,
        });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred while processing your request. Please try again later.',
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

        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpires: { $gt: Date.now() },
        });

        if(!user){
            return res.status(400).json({
                success: false,
                error: "Invalid or expired reset token",
            });
        }

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(newPassword, salt);

        // Clear the reset token fields
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

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

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Error in getUser controller", error);
        res.status(500).json({ message: error.message });
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp; // Store OTP in user model
        user.otpExpires = Date.now() + 300000; // 5-minute expiry
        await user.save();

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
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; color: #b0b0b0;">Hi ${user.name},</p>
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

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        generateToken(user._id, res);
        res.status(200).json({
            message: "OTP verified successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
            },
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
};
