import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  // Days of the week for filter
  const daysOfWeek = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/doctors')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch doctors');
        }
        return res.json();
      })
      .then(data => {
        setDoctors(data);
        setFilteredDoctors(data);
        setIsLoading(false);
        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  // Get unique specialties for the filter
  const specialties = ['All', ...new Set(doctors.map(doctor => doctor.specialty))];

  // Filter doctors based on selected day, specialty and search query
  useEffect(() => {
    let result = [...doctors];
    
    // Filter by availability
    if (selectedDay !== 'All') {
      result = result.filter(doctor => 
        doctor.availability.includes(selectedDay)
      );
    }
    
    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      result = result.filter(doctor => 
        doctor.specialty === selectedSpecialty
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(query) || 
        doctor.specialty.toLowerCase().includes(query) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(query))
      );
    }
    
    setFilteredDoctors(result);
  }, [selectedDay, searchQuery, selectedSpecialty, doctors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Available <span className="text-green-500">Doctors</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
              Browse our team of healthcare professionals and find the perfect specialist for your needs. Filter by day, specialty, or search for specific doctors.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="py-4 px-4 md:px-8 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Search */}
            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or specialty..."
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Day filter */}
            <div className="w-full md:w-1/3">
              <label htmlFor="day-filter" className="block text-sm font-medium text-gray-300 mb-1">Available On</label>
              <select
                id="day-filter"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            {/* Specialty filter */}
            <div className="w-full md:w-1/3">
              <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-300 mb-1">Specialty</label>
              <select
                id="specialty-filter"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 md:px-8">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-green-500 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500 bg-opacity-20 text-red-100 p-4 rounded-lg text-center">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-semibold mb-4">No doctors match your search criteria</h3>
              <p className="text-gray-300 mb-4">Try adjusting your filters or search query</p>
              <button 
                onClick={() => {
                  setSelectedDay('All');
                  setSelectedSpecialty('All');
                  setSearchQuery('');
                }} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-lg mb-6">
                Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.map((doctor, index) => (
                  <div 
                    key={doctor._id} 
                    className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <img 
                        src={doctor.image || 'https://via.placeholder.com/400x300'} 
                        alt={doctor.name} 
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                      <div className="absolute bottom-0 left-0 p-6">
                        <h2 className="text-2xl font-bold">{doctor.name}</h2>
                        <p className="text-green-400 font-medium">{doctor.specialty}</p>
                      </div>
                      
                      {/* Availability Badge */}
                      {selectedDay !== 'All' && doctor.availability.includes(selectedDay) && (
                        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                          Available on {selectedDay}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">About</h3>
                        <p className="text-gray-300">{doctor.bio}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Availability</h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.availability.map((day, i) => (
                            <span 
                              key={i} 
                              className={`px-3 py-1 rounded-full text-sm ${
                                selectedDay === day 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-700 text-gray-300'
                              }`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Link 
                        to={`/appointments?doctor=${doctor._id}`}
                        className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 text-center mt-4"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-10 -mr-20 -mt-20"></div>
            
            <div className="relative z-10 text-center md:w-3/4 mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need help finding the right specialist?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Our team can assist you in finding the perfect match for your healthcare needs.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Contact Support
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