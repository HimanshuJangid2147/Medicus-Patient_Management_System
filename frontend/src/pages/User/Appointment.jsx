import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SuccessfulAppointment from "../../components/AppointmentSucessfull";
import { useAppointmentStore } from "../../store/useAppointmentStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useDoctorStore } from "../../store/useDoctorStore.js";

export default function Appointments() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { createAppointment, isCreating } = useAppointmentStore();
  const { authUser } = useAuthStore();
  const { getAllDoctors } = useDoctorStore();
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    additionalComments: "",
  });

  // Pre-fill patient name if user is logged in
  useEffect(() => {
    if (authUser?.name) {
      setFormData((prev) => ({
        ...prev,
        patientName: authUser.name,
        patientId: authUser._id,
      }));
    }
  }, [authUser]);

  // Fetch doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctorsData = await getAllDoctors();
        if (doctorsData) {
          setDoctors(doctorsData);
        } else {
          toast.error("Could not load doctors list");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors list");
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [getAllDoctors]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // If doctor selection changes, update doctorId and set selectedDoctor
    if (id === "doctorName") {
      const doctor = doctors.find((doctor) => `${doctor.name}` === value);
      if (doctor) {
        setFormData((prev) => ({
          ...prev,
          doctorName: value,
          doctorId: doctor._id,
        }));
        setSelectedDoctor(doctor);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form validation
    if (
        !formData.patientName ||
        !formData.doctorName ||
        !formData.date ||
        !formData.time ||
        !formData.reason
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      // Use the Zustand store's createAppointment method
      const result = await createAppointment(formData);
      if (result) {
        // Create appointment data object for the success component
        const successData = {
          id: result._id || `APP${Math.floor(Math.random() * 1000000)}`,
          patientName: formData.patientName,
          doctorName: formData.doctorName,
          patientId: authUser?._id,
          doctorId: formData.doctorId,
          specialty: selectedDoctor?.specialty || "General Medicine",
          date: formData.date,
          time: formData.time,
          location: selectedDoctor?.office || "Main Hospital, Floor 3, Room 302",
        };

        setAppointmentData(successData);
        setIsSuccess(true);
        toast.success(`Appointment with ${formData.doctorName} confirmed!`);

        // Reset form
        setFormData({
          patientName: authUser?.name || "",
          doctorName: "",
          doctorId: "",
          date: "",
          time: "",
          reason: "",
          additionalComments: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Toast errors are already handled in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset success state to show form again
  const handleBookAnother = () => {
    setIsSuccess(false);
    setAppointmentData(null);
  };

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // If appointment was successful, show the SuccessfulAppointment component
  if (isSuccess && appointmentData) {
    return (
        <SuccessfulAppointment
            appointmentData={appointmentData}
            onBookAnother={handleBookAnother}
        />
    );
  }

  return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        {/* Left Side - Form */}
        <div className="w-full md:w-2/1 p-4 md:p-8 flex items-center justify-center order-2 md:order-1">
          <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 w-full">
                Book an Appointment
              </h1>
              <p className="text-gray-600">
                Fill out the form below to schedule your visit
              </p>
            </div>

            {formData.doctorName && (
                <div className="mb-6 p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-teal-700 text-sm">
                    <span className="font-semibold">You're booking with:</span>{" "}
                    {formData.doctorName}
                    {selectedDoctor?.specialty &&
                        ` (${selectedDoctor.specialty})`}
                  </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                    htmlFor="patientName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Patient Name
                </label>
                <input
                    id="patientName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.patientName || formData.patientId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                />
              </div>

              <div>
                <label
                    htmlFor="doctorName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Doctor
                </label>
                <select
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                    disabled={isLoadingDoctors}
                >
                  <option value="" disabled>
                    {isLoadingDoctors ? "Loading doctors..." : "Choose a doctor"}
                  </option>
                  {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor.name}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                      id="date"
                      type="date"
                      min={minDate}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      required
                  />
                </div>

                <div>
                  <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Time
                  </label>
                  <input
                      id="time"
                      type="time"
                      min="09:00"
                      max="17:00"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Office hours: 9AM - 5PM
                  </p>
                </div>
              </div>

              <div>
                <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for Visit
                </label>
                <textarea
                    id="reason"
                    placeholder="Please describe your symptoms or reason for appointment"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 min-h-[100px] max-h-[150px] resize-y"
                    required
                />
              </div>

              <div>
                <label
                    htmlFor="additionalComments"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Comments
                </label>
                <textarea
                    id="additionalComments"
                    placeholder="Any other information you'd like to provide"
                    value={formData.additionalComments}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 min-h-[80px] max-h-[120px] resize-y"
                />
              </div>

              <button
                  type="submit"
                  disabled={isSubmitting || isCreating || isLoadingDoctors}
                  className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {(isSubmitting || isCreating) ? (
                    <>
                      <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                      >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                ) : (
                    `Book Appointment${formData.doctorName ? ` with ${formData.doctorName}` : ""}`
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Need help? Call us at (123) 456-7890</p>
            </div>
          </div>
        </div>

        {/* Right Side - Image with fixed height to prevent scrolling */}
        <div className="w-full md:w-1/2 bg-gray-50 p-4 md:p-0 flex items-center justify-center order-1 md:order-2">
          <div className="relative w-full h-64 md:h-full max-h-screen overflow-hidden rounded-xl md:rounded-none">
            <img
                src="./src/assets/images/IllustrationSide.png"
                alt="Healthcare professional"
                className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Quality Healthcare at Your Fingertips
              </h2>
              <p className="text-gray-700 text-base mb-4">
                Our dedicated team of professionals is ready to provide you with the
                best medical care.
              </p>
              <div className="flex items-center space-x-2 text-teal-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Certified medical professionals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}