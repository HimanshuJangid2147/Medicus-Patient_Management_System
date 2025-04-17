import { useState, useEffect } from 'react';
import { useContactUsStore } from "../../store/useContactUsStore.js";

export default function Contact() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const { sendContactEmail, isSending } = useContactUsStore();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const result = await sendContactEmail(formData);

    if (result) {
      setFormStatus('success');
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setFormStatus(null);
      }, 3000);
    } else {
      setFormStatus('error');
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    }
  };

  return (
      <div className="min-h-screen bg-white text-gray-800">
        {/* Hero Section */}
        <div className="pt-32 pb-16 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className={`w-full md:w-1/2 transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
                  Get In <span className="text-teal-600">Touch</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Have questions about our services? Need to schedule an appointment? Our team is here to help you with any inquiries.
                </p>
              </div>
              <div className={`w-full md:w-1/2 mt-12 md:mt-0 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-1 rounded-2xl bg-teal-200 opacity-30 blur-xl"></div>
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src="/api/placeholder/600/400"
                        alt="Customer support team"
                        className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className={`transform transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">Our Location</h3>
                      <p className="text-gray-600">123 Healthcare Avenue, Medical District, City, Country</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">Email Us</h3>
                      <p className="text-gray-600">support@medicus.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">Call Us</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`transform transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-white rounded-xl p-8 shadow-md">
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
                  {formStatus === 'success' && (
                      <div className="mb-6 bg-teal-100 text-teal-800 px-4 py-3 rounded">Message sent successfully!</div>
                  )}
                  {formStatus === 'error' && (
                      <div className="mb-6 bg-red-100 text-red-800 px-4 py-3 rounded">Failed to send message. Please try again.</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                      />
                      <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Subject"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Your Message"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSending}
                        className={`${
                            isSending ? 'bg-gray-400' : 'bg-teal-500 hover:bg-teal-600'
                        } text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center`}
                    >
                      {isSending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                      ) : (
                          'Send Message'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}