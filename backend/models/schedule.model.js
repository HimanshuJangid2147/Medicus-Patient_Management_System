import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true },   // e.g., "17:00"
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;