import Notification from "../models/notification.model.js";

export const createNotification = async (req, res) => {
    const { recipientId, recipientType, message, type, relatedAppointmentId } = req.body;
    try {
        const newNotification = new Notification({
            recipientId,
            recipientType,
            message,
            type,
            relatedAppointmentId,
        });

        await newNotification.save();
        return res.status(201).json({
            message: "Notification created successfully",
            notification: { _id: newNotification._id, message: newNotification.message },
        });
    } catch (error) {
        console.error("Error in createNotification controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user._id || req.admin._id || req.doctor._id })
            .populate("relatedAppointmentId", "date time");
        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Error in getNotifications controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        if (notification.recipientId.toString() !== req.user._id && notification.recipientId.toString() !== req.admin._id && notification.recipientId.toString() !== req.doctor._id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        notification.isRead = true;
        await notification.save();
        return res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error in markNotificationAsRead controller", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        if (notification.recipientId.toString() !== req.user._id && notification.recipientId.toString() !== req.admin._id && notification.recipientId.toString() !== req.doctor._id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        await Notification.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error in deleteNotification controller", error);
        return res.status(500).json({ message: error.message });
    }
};