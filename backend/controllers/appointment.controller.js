import Appointment from "../models/appointment.model.js";

export const createAppointment = async (req, res) => {
  const {
    patientId,
    doctorId,
    patientName,
    doctorName,
    date,
    time,
    reason,
    notes,
  } = req.body;
  try {
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      patientName,
      doctorName,
      date,
      time,
      reason,
      notes,
    });

    await newAppointment.save();
    return res.status(201).json({
      message: "Appointment created successfully",
      appointment: {
        _id: newAppointment._id,
        patientId: newAppointment.patientId,
        doctorId: newAppointment.doctorId,
        patientName: newAppointment.patientName,
        doctorName: newAppointment.doctorName,
        date: newAppointment.date,
        time: newAppointment.time,
      },
    });
  } catch (error) {
    console.error("Error in createAppointment controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "fullName email")
      .populate("doctorId", "name specialty");
    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getAllAppointments controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "fullName email")
      .populate("doctorId", "name specialty");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    console.error("Error in getAppointmentById controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id,
    }).populate("doctorId", "name specialty");
    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getAppointmentsByPatient controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.doctor._id,
    }).populate("patientId", "fullName email");
    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getAppointmentsByDoctor controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { date, time, reason, status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (
      appointment.patientId.toString() !== req.user._id &&
      appointment.doctorId.toString() !== req.doctor._id
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this appointment" });
    }

    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.reason = reason || appointment.reason;
    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;

    await appointment.save();
    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error in updateAppointment controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (
      appointment.patientId.toString() !== req.user._id &&
      appointment.doctorId.toString() !== req.doctor._id
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this appointment" });
    }
    await Appointment.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAppointment controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the user has permission to cancel this appointment
    // If admin exists in request, they have permission
    // If doctor exists and matches the appointment's doctorId, they have permission
    // If user exists and matches the appointment's patientId, they have permission
    const isAdmin = !!req.admin;
    const isDoctor = req.doctor && appointment.doctorId.toString() === req.doctor._id.toString();
    const isPatient = req.user && appointment.patientId.toString() === req.user._id.toString();

    if (!isAdmin && !isDoctor && !isPatient) {
      return res.status(403).json({
        message: "Unauthorized to cancel this appointment",
        role: req.admin ? "admin" : req.doctor ? "doctor" : "user"
      });
    }

    // Update the appointment status
    appointment.status = "Cancelled";

    // Add cancellation metadata
    const cancelledBy = req.admin ? "Admin" : req.doctor ? "Doctor" : "Patient";
    appointment.cancellationReason = cancellationReason;
    appointment.notes = appointment.notes
        ? `${appointment.notes}\n\nCancellation reason: ${cancellationReason} (Cancelled by: ${cancelledBy})`
        : `Cancellation reason: ${cancellationReason} (Cancelled by: ${cancelledBy})`;

    await appointment.save();

    return res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (error) {
    console.error("Error in cancelAppointment controller", error);
    return res.status(500).json({ message: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the user has permission to reschedule this appointment
    // If admin exists in request, they have permission
    // If doctor exists and matches the appointment's doctorId, they have permission
    // If user exists and matches the appointment's patientId, they have permission
    const isAdmin = req.admin ? true : false;
    const isDoctor = req.doctor && appointment.doctorId.toString() === req.doctor._id.toString();
    const isPatient = req.user && appointment.patientId.toString() === req.user._id.toString();

    if (!isAdmin && !isDoctor && !isPatient) {
      return res.status(403).json({
        message: "Unauthorized to reschedule this appointment",
        role: req.admin ? "admin" : req.doctor ? "doctor" : "user"
      });
    }

    // Update the appointment date and time
    appointment.date = date;
    appointment.time = time;

    await appointment.save();

    return res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment
    });
  } catch (error) {
    console.error("Error in rescheduleAppointment controller", error);
    return res.status(500).json({ message: error.message });
  }
};
