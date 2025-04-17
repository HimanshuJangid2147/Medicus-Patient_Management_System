import Schedule from "../models/schedule.model.js";

export const createSchedule = async (req, res) => {
    const { doctorId, date, startTime, endTime } = req.body;
    try {
        const newSchedule = new Schedule({
            doctorId,
            date,
            startTime,
            endTime,
        });

        await newSchedule.save();
        return res.status(201).json({
            message: "Schedule created successfully",
            schedule: { _id: newSchedule._id, date: newSchedule.date, startTime: newSchedule.startTime },
        });
    } catch (error) {
        console.error("Error in createSchedule controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getScheduleByDoctor = async (req, res) => {
    try {
        const schedules = await Schedule.find({ doctorId: req.doctor._id });
        return res.status(200).json(schedules);
    } catch (error) {
        console.error("Error in getScheduleByDoctor controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateSchedule = async (req, res) => {
    try {
        const { date, startTime, endTime, isAvailable } = req.body;
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        if (schedule.doctorId.toString() !== req.doctor._id) {
            return res.status(403).json({ message: "Unauthorized to update this schedule" });
        }

        schedule.date = date || schedule.date;
        schedule.startTime = startTime || schedule.startTime;
        schedule.endTime = endTime || schedule.endTime;
        schedule.isAvailable = isAvailable !== undefined ? isAvailable : schedule.isAvailable;

        await schedule.save();
        return res.status(200).json({
            message: "Schedule updated successfully",
            schedule,
        });
    } catch (error) {
        console.error("Error in updateSchedule controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        if (schedule.doctorId.toString() !== req.doctor._id) {
            return res.status(403).json({ message: "Unauthorized to delete this schedule" });
        }

        await Schedule.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
        console.error("Error in deleteSchedule controller", error);
        return res.status(500).json({ message: error.message });
    }
};