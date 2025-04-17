import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDoctorStore } from "../../store/useDoctorStore.js";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableNow, setAvailableNow] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const { getAllDoctors, getDoctorAvailability } = useDoctorStore();

  useEffect(() => {
    const fetchDoctorsWithAvailability = async () => {
      try {
        setIsLoading(true);
        // First get all doctors
        const doctorsData = await getAllDoctors();

        if (!doctorsData) {
          throw new Error('Failed to load doctors');
        }

        // Then fetch availability for each doctor
        const doctorsWithAvailability = await Promise.all(
            doctorsData.map(async (doctor) => {
              const availability = await getDoctorAvailability(doctor._id);

              // Convert availability to a boolean isAvailableNow property
              // Assuming the availability is a simple Yes/No status
              const isAvailableNow =
                  availability === "Yes" ||
                  (Array.isArray(availability) && availability.includes("Yes"));

              return { ...doctor, availability, isAvailableNow };
            })
        );

        setDoctors(doctorsWithAvailability);
        setFilteredDoctors(doctorsWithAvailability);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorsWithAvailability();
  }, [getAllDoctors, getDoctorAvailability]);

  // Get unique specialties for the filter
  const specialties = ['All', ...new Set(doctors.map(doctor => doctor.specialty))];
  const availabilityOptions = ['All', 'Yes', 'No'];

  // Filter doctors based on availability now, specialty and search query
  useEffect(() => {
    let result = [...doctors];

    // Filter by availability
    if (availableNow !== 'All') {
      const isAvailable = availableNow === 'Yes';
      result = result.filter(doctor =>
          isAvailable ? doctor.isAvailableNow : !doctor.isAvailableNow
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
  }, [availableNow, searchQuery, selectedSpecialty, doctors]);

  return (
      <div className="min-h-screen bg-white text-gray-800">
        {/* Hero Section */}
        <div className="pt-32 pb-16 px-4 md:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Available <span className="text-teal-600">Doctors</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl">
                Browse our team of healthcare professionals and find the perfect specialist for your needs. Filter by availability, specialty, or search for specific doctors.
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="py-4 px-4 md:px-8 bg-gray-100">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search */}
              <div className="w-full md:w-1/3">
                <label htmlFor="search" className="block text-sm font-medium text-gray-600 mb-1">Search</label>
                <input
                    type="text"
                    id="search"
                    placeholder="Search by name or specialty..."
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Available Now filter */}
              <div className="w-full md:w-1/3">
                <label htmlFor="availability-filter" className="block text-sm font-medium text-gray-600 mb-1">Available Now</label>
                <select
                    id="availability-filter"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={availableNow}
                    onChange={(e) => setAvailableNow(e.target.value)}
                >
                  {availabilityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Specialty filter */}
              <div className="w-full md:w-1/3">
                <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-600 mb-1">Specialty</label>
                <select
                    id="specialty-filter"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
        <div className="py-16 px-4 md:px-8">
          <div className="container mx-auto">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-gray-200 rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                  <p>{error}</p>
                  <button
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
            ) : filteredDoctors.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-xl text-center">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">No doctors match your search criteria</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                  <button
                      onClick={() => {
                        setAvailableNow('All');
                        setSelectedSpecialty('All');
                        setSearchQuery('');
                      }}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
            ) : (
                <>
                  <p className="text-lg mb-6 text-gray-600">
                    Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor, index) => (
                        <div
                            key={doctor._id}
                            className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-500 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="relative">
                            <img
                                src={doctor.image || '/api/placeholder/400/300'}
                                alt={doctor.name}
                                className="w-full h-56 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                              <h2 className="text-2xl font-bold text-white">{doctor.name}</h2>
                              <p className="text-teal-300 font-medium">{doctor.specialty}</p>
                            </div>

                            {/* Availability Badge */}
                            <div className={`absolute top-4 right-4 ${doctor.isAvailableNow ? 'bg-teal-500' : 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}>
                              {doctor.isAvailableNow ? 'Available Now' : 'Not Available'}
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold mb-2 text-gray-800">About</h3>
                              <p className="text-gray-600">{doctor.bio}</p>
                            </div>

                            <div className="mb-4">
                              <h3 className="text-lg font-semibold mb-2 text-gray-800">Availability</h3>
                              <div className="flex flex-wrap gap-2">
                                {doctor.isAvailableNow ? (
                                    <span className="px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-600 font-medium">
                                    Available for appointments
                                  </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                                    Currently unavailable
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                                to={`/appointments?doctor=${doctor._id}`}
                                className="block w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 text-center mt-4"
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
        <div className="py-16 px-4 md:px-8 bg-teal-500">
          <div className="container mx-auto">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need help finding the right specialist?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Our team can assist you in finding the perfect match for your healthcare needs.
              </p>
              <Link
                  to="/contact"
                  className="inline-block bg-white text-teal-600 font-medium px-8 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-4 md:px-8 bg-gray-100">
          <div className="container mx-auto text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Medicus. All rights reserved.</p>
            <p className="mt-2">Providing quality healthcare services for a healthier tomorrow.</p>
          </div>
        </footer>
      </div>
  );
}