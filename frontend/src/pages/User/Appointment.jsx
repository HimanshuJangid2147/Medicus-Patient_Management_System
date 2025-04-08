import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Appointments() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
    reason: "",
    additionalComments: ""  // Added this to match your form fields
  });

  // Sample doctors list - you would fetch this from an API in a real application
  const doctors = [
    "Dr. Sarah Johnson",
    "Dr. Michael Chen",
    "Dr. Emily Rodriguez",
    "Dr. James Wilson",
    "Dr. Aisha Patel"
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.patientName || !formData.doctorName || !formData.date || !formData.time || !formData.reason) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add a timeout to simulate API call in development if needed
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success("Appointment booked successfully!");
        setFormData({
          patientName: "",
          doctorName: "",
          date: "",
          time: "",
          reason: "",
          additionalComments: ""
        });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Left Side - Form */}
      <div className="w-full md:w-2/1 p-4 md:p-8 flex items-center justify-center order-2 md:order-1">
        <div className="w-full max-w-md p-6 rounded-xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2 w-full">Book an Appointment</h1>
            <p className="text-gray-400">Fill out the form below to schedule your visit</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-300 mb-1">
                Patient Name
              </label>
              <input
                id="patientName"
                type="text"
                placeholder="Enter your full name"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <div>
              <label htmlFor="doctorName" className="block text-sm font-medium text-gray-300 mb-1">
                Select Doctor
              </label>
              <select
                id="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                required
              >
                <option value="" disabled>Choose a doctor</option>
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor}>{doctor}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  min="09:00"
                  max="17:00"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Office hours: 9AM - 5PM</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">
                Reason for Visit
              </label>
              <textarea
                id="reason"
                placeholder="Please describe your symptoms or reason for appointment"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 min-h-[100px] max-h-[150px] resize-y"
                required
              />
            </div>

            <div>
              <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-300 mb-1">
                Additional Comments
              </label>
              <textarea
                id="additionalComments"
                placeholder="Any other information you'd like to provide"
                value={formData.additionalComments}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 min-h-[80px] max-h-[120px] resize-y"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Book Appointment"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Need help? Call us at (123) 456-7890</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Image with fixed height to prevent scrolling */}
      <div className="w-full md:w-1/2 bg-gray-900 p-4 md:p-0 flex items-center justify-center order-1 md:order-2">
        <div className="relative w-full h-64 md:h-full max-h-screen overflow-hidden rounded-xl md:rounded-none">
          <img
            src="./src/assets/images/Illustration.png"
            alt="Healthcare professional"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-70 md:opacity-40"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Quality Healthcare at Your Fingertips</h2>
            <p className="text-gray-200 text-base mb-4">Our dedicated team of professionals is ready to provide you with the best medical care.</p>
            <div className="flex items-center space-x-2 text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Certified medical professionals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}