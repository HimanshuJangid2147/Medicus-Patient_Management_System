import express from "express";
import {
  checkAuth,
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  updateUser,
  getUser,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); // working (Postman Tested)
router.post("/login", login); // working (Postman Tested)
router.post("/logout", logout); // working (Postman Tested)
router.post("/forgot-password", forgotPassword); // working (Postman Tested)
router.get('/verify-reset-token/:resetToken', verifyResetToken);
router.post("/reset-password", resetPassword);
router.put("/update-user", protectRoute, updateUser);
router.get("/check", protectRoute, checkAuth); // working (Postman Tested)
router.get("/user", protectRoute, getUser); // Added protection
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;