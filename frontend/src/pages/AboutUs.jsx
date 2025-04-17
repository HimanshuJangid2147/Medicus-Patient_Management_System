import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaHospital, FaHistory, FaMedal } from 'react-icons/fa';

const AboutUs = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Team data
    const teamMembers = [
        {
            name: "Dr. Sarah Johnson",
            role: "Chief Medical Officer",
            image: "./src/assets/images/doctor1.jpg",
            specialty: "Cardiology"
        },
        {
            name: "Dr. Michael Chen",
            role: "Medical Director",
            image: "./src/assets/images/doctor2.jpg",
            specialty: "Neurology"
        },
        {
            name: "Dr. Emily Rodriguez",
            role: "Head of Patient Services",
            image: "./src/assets/images/doctor3.jpg",
            specialty: "Family Medicine"
        },
        {
            name: "Dr. David Wilson",
            role: "Technical Director",
            image: "./src/assets/images/doctor4.jpg",
            specialty: "Healthcare Informatics"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-4 md:px-8 fixed w-full z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/">
                            <img src="./src/assets/logos/logoo.svg" alt="Medicus Logo" className="h-10" />
                        </Link>
                        <h1 className="text-2xl font-bold text-teal-600 ml-2">Medicus</h1>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
                        <Link to="/about" className="text-teal-600 font-medium border-b-2 border-teal-600 transition-colors">About</Link>
                        <Link to="/doctors" className="text-gray-600 hover:text-teal-600 transition-colors">Doctors</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 md:px-8 bg-gradient-to-b from-teal-50 to-white">
                <div className="container mx-auto">
                    <div className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-800">
                            About <span className="text-teal-600">Medicus</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">
                            Transforming healthcare through technology to create better patient experiences and more efficient medical practices.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-16 px-4 md:px-8">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className={`w-full md:w-1/2 transform transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                At Medicus, our mission is to revolutionize healthcare management by providing an intuitive and comprehensive platform that connects patients with healthcare providers, streamlines administrative processes, and enhances the overall healthcare experience.
                            </p>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We believe that technology should serve as a bridge between patients and healthcare providers, making quality healthcare more accessible, efficient, and personalized for everyone.
                            </p>
                            <div className="flex items-center p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                                <div className="text-teal-600 mr-4">
                                    <FaMedal size={24} />
                                </div>
                                <p className="text-gray-700 font-medium">
                                    "Empowering healthcare through innovation, accessibility, and compassion."
                                </p>
                            </div>
                        </div>

                        <div className={`w-full md:w-1/2 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="relative mx-auto max-w-md">
                                <div className="absolute -inset-1 rounded-2xl bg-teal-200 opacity-30 blur-xl"></div>
                                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="./src/assets/images/mission.jpg"
                                        alt="Healthcare professionals in a meeting"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 px-4 md:px-8 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Our Core Values</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <div className={`bg-white rounded-xl p-8 shadow-md transform transition-all duration-500 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-6">
                                <FaUserMd className="h-8 w-8 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Patient-Centered Care</h3>
                            <p className="text-gray-600 text-center">
                                We place patients at the center of everything we do, ensuring that our platform is designed to meet their unique healthcare needs and preferences.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className={`bg-white rounded-xl p-8 shadow-md transform transition-all duration-500 delay-100 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Privacy & Security</h3>
                            <p className="text-gray-600 text-center">
                                We maintain the highest standards of privacy and security to safeguard patient information and build trust within our healthcare ecosystem.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className={`bg-white rounded-xl p-8 shadow-md transform transition-all duration-500 delay-200 hover:-translate-y-2 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Continuous Innovation</h3>
                            <p className="text-gray-600 text-center">
                                We are committed to continuously improving our platform through technological innovation and user feedback to meet the evolving needs of modern healthcare.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 px-4 md:px-8">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Story</h2>
                        
                        <div className="space-y-12">
                            {/* Timeline Item 1 */}
                            <div className={`flex flex-col md:flex-row transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="md:w-1/4">
                                    <div className="flex items-center md:justify-end mb-4 md:mb-0">
                                        <div className="bg-teal-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center">
                                            <FaHistory />
                                        </div>
                                        <div className="hidden md:block w-12 border-t-2 border-teal-300 ml-4"></div>
                                    </div>
                                </div>
                                <div className="md:w-3/4 md:pl-12">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">2018: The Beginning</h3>
                                    <p className="text-gray-600">
                                        Medicus was founded by a team of healthcare professionals and technology experts who recognized the need for a more streamlined, patient-focused healthcare management system. Our journey began with a simple mission: to make healthcare more accessible.
                                    </p>
                                </div>
                            </div>

                            {/* Timeline Item 2 */}
                            <div className={`flex flex-col md:flex-row transform transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="md:w-1/4">
                                    <div className="flex items-center md:justify-end mb-4 md:mb-0">
                                        <div className="bg-teal-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center">
                                            <FaHospital />
                                        </div>
                                        <div className="hidden md:block w-12 border-t-2 border-teal-300 ml-4"></div>
                                    </div>
                                </div>
                                <div className="md:w-3/4 md:pl-12">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">2020: Expanding Access</h3>
                                    <p className="text-gray-600">
                                        After two years of development and testing, we launched our first complete platform. During the global pandemic, we pivoted to incorporate telehealth services, helping patients connect with doctors remotely during a critical time.
                                    </p>
                                </div>
                            </div>

                            {/* Timeline Item 3 */}
                            <div className={`flex flex-col md:flex-row transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="md:w-1/4">
                                    <div className="flex items-center md:justify-end mb-4 md:mb-0">
                                        <div className="bg-teal-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center">
                                            <FaMedal />
                                        </div>
                                        <div className="hidden md:block w-12 border-t-2 border-teal-300 ml-4"></div>
                                    </div>
                                </div>
                                <div className="md:w-3/4 md:pl-12">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Today: Leading Innovation</h3>
                                    <p className="text-gray-600">
                                        Today, Medicus serves thousands of patients and healthcare providers across the country. We continue to innovate, recently adding AI-powered features to enhance patient care and implementing blockchain technology for secure medical records.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Our Team */}
            {/* <section className="py-16 px-4 md:px-8 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Meet Our Leadership Team</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div 
                                key={index}
                                className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-500 delay-${index * 100} hover:-translate-y-2 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            >
                                <div className="h-48 overflow-hidden">
                                    <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h3>
                                    <p className="text-teal-600 font-medium mb-2">{member.role}</p>
                                    <p className="text-gray-600">Specialty: {member.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Testimonials */}
            <section className="py-16 px-4 md:px-8">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">What People Say About Us</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className={`bg-white rounded-xl p-8 shadow-md transform transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 italic">
                                "Medicus has transformed how I manage my healthcare. Booking appointments is seamless, and having all my medical records in one place has been invaluable. The telehealth feature saved me so much time!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Rebecca Thompson</h4>
                                    <p className="text-gray-600 text-sm">Patient since 2020</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className={`bg-white rounded-xl p-8 shadow-md transform transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 italic">
                                "As a physician, Medicus has streamlined my practice significantly. I can easily manage patient appointments, access records quickly, and provide more personalized care. The platform is intuitive and saves me hours each week."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Dr. James Williams</h4>
                                    <p className="text-gray-600 text-sm">Cardiologist</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className={`bg-white rounded-xl p-8 shadow-md transform transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 italic">
                                "Managing a medical facility is complex, but Medicus has simplified our administrative processes tremendously. The analytics and reporting features help us make better decisions for our practice and patients."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Lisa Martinez</h4>
                                    <p className="text-gray-600 text-sm">Clinic Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 md:px-8 bg-teal-500">
                <div className="container mx-auto">
                    <div className="text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Medicus Community</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Be part of our journey to transform healthcare. Create your account today and experience the difference.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/signup"
                                className="inline-block bg-white text-teal-600 font-medium px-8 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                            >
                                Sign Up as Patient
                            </Link>
                            <Link
                                to="/doctor-register"
                                className="inline-block bg-teal-600 text-white border border-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 hover:bg-teal-700"
                            >
                                Register as Doctor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 md:px-8 bg-gray-100">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <img src="./src/assets/logos/logoo.svg" alt="Medicus Logo" className="h-8" />
                                <h3 className="text-xl font-bold text-teal-600 ml-2">Medicus</h3>
                            </div>
                            <p className="text-gray-600">Providing quality healthcare services for a healthier tomorrow.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/about" className="text-gray-600 hover:text-teal-600">About Us</Link></li>
                                <li><Link to="/contact" className="text-gray-600 hover:text-teal-600">Contact</Link></li>
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
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;