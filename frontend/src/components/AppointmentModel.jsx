import React, { useState, useEffect, useRef } from "react";
import { useDoctorStore } from "../store/useDoctorStore";

const AppointmentModal = ({ isOpen, onClose, onSchedule, appointment }) => {
  const [doctor, setDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("10:00"); // Add time state
  const [additionalComments, setAdditionalComments] = useState(""); // Add comments state
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  const { getAllDoctors } = useDoctorStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target))
        onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (appointment) {
      setDoctor(appointment.doctorName || "");
      setReason(appointment.reason || "");
      setAppointmentDate(
        appointment.date
          ? new Date(appointment.date).toISOString().split("T")[0]
          : ""
      );
      setAppointmentTime(appointment.time || "10:00");
      setAdditionalComments(appointment.notes || "");
    } else {
      setDoctor("");
      setReason("");
      setAppointmentDate("");
      setAppointmentTime("10:00");
      setAdditionalComments("");
    }
  }, [appointment]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const doctorsData = await getAllDoctors();
        if (doctorsData) {
          setAvailableDoctors(doctorsData);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen, getAllDoctors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDoctor = availableDoctors.find((doc) => doc.name === doctor);
    onSchedule({
      doctor: doctor,
      doctorId: selectedDoctor ? selectedDoctor._id : null, // Use _id instead of id
      reason,
      appointmentDate,
      appointmentTime,
      additionalComments,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white border border-gray-300 rounded-lg w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800">
            Schedule Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Please fill in the following details to schedule
          </p>

          <form onSubmit={handleSubmit}>
            {/* Doctor Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="doctor">
                Doctor
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center">
                    {doctor ? (
                      <>
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white font-medium">
                            {doctor.split(" ")[1][0]}
                          </span>
                        </div>
                        <span className="text-gray-800">{doctor}</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <span className="text-gray-400">Select a doctor</span>
                      </>
                    )}
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
                      </div>
                    ) : availableDoctors.length > 0 ? (
                      availableDoctors.map((doc) => (
                        <div
                          key={doc._id}
                          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setDoctor(doc.name);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white font-medium">
                              {doc.name ? doc.name.charAt(0) : "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-800">{doc.name}</p>
                            <p className="text-gray-600 text-sm">
                              {doc.specialty || "General Doctor"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">
                        No doctors available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Time */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="time">
                Appointment time
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Appointment Date */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="date">
                Expected appointment date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Reason for appointment */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="reason">
                Reason for appointment
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ex: Annual monthly check-up"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none"
                rows="4"
              />
            </div>

            {/* Additional Comments */}
            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="additionalComments"
              >
                Additional Comments (Optional)
              </label>
              <textarea
                id="additionalComments"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Any additional information you'd like to provide"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none"
                rows="3"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 transition-colors text-white py-3 px-4 rounded-lg font-medium"
              disabled={
                !doctor || !reason || !appointmentDate || !appointmentTime
              }
            >
              Schedule Appointment
              {appointment ? "Update appointment" : "Schedule appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
