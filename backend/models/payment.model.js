import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    paymentDate: { type: Date },
    insuranceClaim: { type: String },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;