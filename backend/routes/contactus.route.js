import express from "express";
import { sendContactEmail } from "../controllers/contactus.controller.js";
import { validateContact } from "../middleware/validContact.middleware.js";

const router = express.Router();

router.post("/", validateContact, sendContactEmail);

export default router;
