import Payment from "../models/payment.model.js";

export const createPayment = async (req, res) => {
    const { patientId, appointmentId, amount, insuranceClaim } = req.body;
    try {
        const newPayment = new Payment({
            patientId,
            appointmentId,
            amount,
            insuranceClaim,
        });

        await newPayment.save();
        return res.status(201).json({
            message: "Payment created successfully",
            payment: { _id: newPayment._id, amount: newPayment.amount, status: newPayment.status },
        });
    } catch (error) {
        console.error("Error in createPayment controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate("patientId", "fullName email")
            .populate("appointmentId", "date time");
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        if (payment.patientId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        return res.status(200).json(payment);
    } catch (error) {
        console.error("Error in getPaymentById controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { status, paymentDate } = req.body;
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        if (payment.patientId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized to update this payment" });
        }

        payment.status = status || payment.status;
        payment.paymentDate = paymentDate || payment.paymentDate;

        await payment.save();
        return res.status(200).json({
            message: "Payment status updated successfully",
            payment,
        });
    } catch (error) {
        console.error("Error in updatePaymentStatus controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        if (payment.patientId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized to delete this payment" });
        }

        await Payment.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error in deletePayment controller", error);
        return res.status(500).json({ message: error.message });
    }
};