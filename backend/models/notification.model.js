// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "recipientType", // Dynamic reference to User, Admin, or Doctor
        required: true,
    },
    recipientType: {
        type: String,
        enum: ["User", "Admin", "Doctor"],
        required: true,
    },
    message: { type: String, required: true },
    type: { type: String, enum: ["Appointment", "Reminder", "Alert"], required: true },
    isRead: { type: Boolean, default: false },
    relatedAppointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;