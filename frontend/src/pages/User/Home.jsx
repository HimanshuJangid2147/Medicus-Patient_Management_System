import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className={`w-full md:w-1/2 transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Your Health, <span className="text-green-500">Our Priority</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Experience healthcare that's centered around you. Book appointments with top specialists and take control of your wellbeing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/appointments" 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
                >
                  Book Appointment
                </Link>
                <Link 
                  to="/doctors" 
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-center"
                >
                  Meet Our Doctors
                </Link>
              </div>
            </div>
            
            <div className={`w-full md:w-1/2 mt-12 md:mt-0 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-1 rounded-2xl bg-green-500 opacity-30 blur-xl"></div>
                <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
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

      {/* Features Section */}
      <div className="py-16 px-4 md:px-8 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Healthcare Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`bg-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-500 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-14 h-14 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Doctors</h3>
              <p className="text-gray-300">Access to a network of highly qualified specialists with years of experience in their fields.</p>
            </div>
            
            {/* Feature 2 */}
            <div className={`bg-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-500 delay-100 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-14 h-14 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Appointments</h3>
              <p className="text-gray-300">Schedule appointments easily with our intuitive booking system. No long waiting times.</p>
            </div>
            
            {/* Feature 3 */}
            <div className={`bg-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-500 delay-200 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-14 h-14 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Modern Facilities</h3>
              <p className="text-gray-300">State-of-the-art equipment and comfortable facilities designed for your best care experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-10 -mr-20 -mt-20"></div>
            
            <div className="relative z-10 text-center md:w-3/4 mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to prioritize your health?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Take the first step towards better healthcare today. Our team of professionals is ready to help you.
              </p>
              <Link 
                to="/appointments" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Book Your Appointment Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Healthcare. All rights reserved.</p>
          <p className="mt-2">Providing quality healthcare services for a healthier tomorrow.</p>
        </div>
      </footer>
    </div>
  );
}