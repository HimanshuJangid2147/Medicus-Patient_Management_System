import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
      <div className="min-h-screen bg-white text-gray-800">

        {/* Hero Section */}
        <div className="pt-32 pb-16 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className={`w-full md:w-1/2 transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
                  Your Health, <span className="text-teal-600">Our Priority</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Experience healthcare that puts you first. Book appointments with top specialists and take control of your wellbeing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                      to="/appointments"
                      className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
                  >
                    Book Appointment
                  </Link>
                  <Link
                      to="/doctors"
                      className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
                  >
                    Meet Our Doctors
                  </Link>
                </div>
              </div>

              <div className={`w-full md:w-1/2 mt-12 md:mt-0 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-1 rounded-2xl bg-teal-200 opacity-30 blur-xl"></div>
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src="/api/placeholder/600/400"
                        alt="Healthcare professionals"
                        className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Our Medical Services</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Comprehensive healthcare solutions designed to meet your needs with expert care and advanced technology.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Cardiology</h3>
                <p className="text-gray-600">Advanced diagnostics and treatments for heart conditions by our board-certified cardiologists.</p>
              </div>

              {/* Service 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Pediatrics</h3>
                <p className="text-gray-600">Specialized care for children of all ages, from routine check-ups to specialized treatments.</p>
              </div>

              {/* Service 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Digital Records</h3>
                <p className="text-gray-600">Secure access to your medical records, test results, and personalized health plans anytime.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose Medicus</h2>

            <div className="grid md:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Expert Doctors</h3>
                <p className="text-gray-600 text-sm">Board-certified specialists with years of clinical experience</p>
              </div>

              {/* Feature 2 */}
              <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 delay-100 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Easy Scheduling</h3>
                <p className="text-gray-600 text-sm">Book appointments online in minutes, 24/7</p>
              </div>

              {/* Feature 3 */}
              <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 delay-200 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Telehealth</h3>
                <p className="text-gray-600 text-sm">Virtual consultations from the comfort of your home</p>
              </div>

              {/* Feature 4 */}
              <div className={`bg-white rounded-xl p-6 shadow-md text-center transform transition-all duration-500 delay-300 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Modern Facilities</h3>
                <p className="text-gray-600 text-sm">State-of-the-art equipment and comfortable environments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Patient Testimonials</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">See what our patients have to say about their experience with Medicus.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <span className="text-teal-600 text-xl font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Sarah Johnson</h4>
                    <p className="text-gray-500 text-sm">Patient since 2023</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The doctors at Medicus took the time to listen to my concerns. The online booking system is incredibly convenient, and I love being able to access my records anytime."
                </p>
                <div className="mt-4 flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <span className="text-teal-600 text-xl font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Michael Brown</h4>
                    <p className="text-gray-500 text-sm">Cardiology Patient</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "After my heart surgery, the follow-up care has been exceptional. The doctors explain everything in detail, and the staff is always responsive to questions. Truly patient-centered care."
                </p>
                <div className="mt-4 flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 px-4 md:px-8 bg-teal-500">
          <div className="container mx-auto">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to prioritize your health?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Schedule your appointment today and take the first step towards better healthcare.
              </p>
              <Link
                  to="/appointments"
                  className="inline-block bg-white text-teal-600 font-medium px-8 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-4 md:px-8 bg-gray-100">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-teal-600">Medicus</h3>
                <p className="text-gray-600">Providing quality healthcare services for a healthier tomorrow.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Services</h3>
                <ul className="space-y-2">
                  <li><Link to="/services/cardiology" className="text-gray-600 hover:text-teal-600">Cardiology</Link></li>
                  <li><Link to="/services/dermatology" className="text-gray-600 hover:text-teal-600">Dermatology</Link></li>
                  <li><Link to="/services/orthopedics" className="text-gray-600 hover:text-teal-600">Orthopedics</Link></li>
                  <li><Link to="/services/pediatrics" className="text-gray-600 hover:text-teal-600">Pediatrics</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-600 hover:text-teal-600">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-600 hover:text-teal-600">Contact</Link></li>
                  <li><Link to="/faq" className="text-gray-600 hover:text-teal-600">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Contact</h3>
                <p className="text-gray-600">1234 Medical Drive<br />Healthcare City, HC 12345</p>
                <p className="text-gray-600 mt-2">contact@medicus.com<br />+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-6 text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} Medicus. All rights reserved.</p>
              <p className="mt-2">Providing quality healthcare services for a healthier tomorrow.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}