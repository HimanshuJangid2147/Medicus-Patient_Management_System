import React, { useState } from 'react';

const RescheduleAppointmentModal = ({ isOpen, onClose, appointment, onReschedule }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onReschedule(appointment.id, newDate, newTime);
        onClose();
    };

    if (!isOpen || !appointment) return null;

    return (
        <div className="modal">
            <h2>Reschedule Appointment</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                />
                <button type="button" onClick={onClose}>Cancel</button>
                <button type="submit">Reschedule Appointment</button>
            </form>
        </div>
    );
};

export default RescheduleAppointmentModal;
