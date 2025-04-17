import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  checkAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin); // working (Postman Tested)
router.post("/login", loginAdmin); // working (Postman Tested)
router.post("/logout", logoutAdmin);  // working (Postman Tested)
router.get("/check", protectAdminRoute, checkAdmin);
router.put("/update", protectAdminRoute, updateAdmin);
router.delete("/delete", protectAdminRoute, deleteAdmin);

export default router;