import { useState, useEffect } from 'react';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <div key={doctor._id} className="bg-white p-6 rounded-lg shadow-md">
            <img src={doctor.image || 'https://via.placeholder.com/150'} alt={doctor.name} className="w-full h-40 object-cover mb-4 rounded" />
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.specialty}</p>
            <p className="mt-2">{doctor.bio}</p>
            <p className="mt-2">Availability: {doctor.availability.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}