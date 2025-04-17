import React, { useState, useEffect, useRef } from 'react';

const CancelAppointmentModal = ({ isOpen, onClose, appointment, onCancel }) => {
    const [cancelReason, setCancelReason] = useState('');
    const [confirmCancel, setConfirmCancel] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setCancelReason('');
            setConfirmCancel(false);
        }
    }, [isOpen]);

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onCancel(appointment.id, cancelReason);
        onClose();
    };

    if (!isOpen || !appointment) return null;

    return (
        <div ref={modalRef} className="modal">
            <h2>Cancel Appointment</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Reason for cancellation"
                    required
                />
                <div>
                    <input
                        type="checkbox"
                        checked={confirmCancel}
                        onChange={(e) => setConfirmCancel(e.target.checked)}
                        required
                    />
                    <label>I confirm that I want to cancel this appointment</label>
                </div>
                <button type="button" onClick={onClose}>Keep Appointment</button>
                <button type="submit" disabled={!confirmCancel}>Cancel Appointment</button>
            </form>
        </div>
    );
};

export default CancelAppointmentModal;
