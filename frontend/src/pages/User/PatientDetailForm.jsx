import patientform from "../../assets/images/patientformside.png";
import React, { useState, useEffect } from "react";
import { usePatientFormStore } from "../../store/usePatientFormStore.js";
import { useDoctorStore } from "../../store/useDoctorStore.js";
import { useNavigate } from "react-router-dom";

const PatientDetailForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyPhoneNumber: "",
    primaryPhysician: "",
    doctorId: "",
    primaryPhysicianId: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: "",
    currentMedications: "",
    familyMedicalHistory: "",
    pastMedicalHistory: "",
    identificationType: "Birth Certificate",
    identificationNumber: "",
    consentTreatment: true,
    consentDisclosure: false,
    privacyPolicy: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  const { createPatient, isCreating } = usePatientFormStore();
  const { getAllDoctors } = useDoctorStore();
  const navigate = useNavigate();

  // Fetch all doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctorsList = await getAllDoctors();
        if (doctorsList && doctorsList.length > 0) {
          setDoctors(doctorsList);

          // Set default primary physician to first doctor in the list
          if (doctorsList.length > 0) {
            setFormData((prev) => ({
              ...prev,
              primaryPhysician: doctorsList[0].name,
              primaryPhysicianId: doctorsList[0]._id,
              doctorId: doctorsList[0]._id,
            }));
          }
        } else {
          // Fallback default values
          setFormData((prev) => ({
            ...prev,
            primaryPhysician: "Dr. Adam Smith",
            doctorId: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [getAllDoctors]);

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName) {
      errors.fullName = "Full name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.address) {
      errors.address = "Address is required";
    }
    if (!formData.doctorId) {
      errors.doctorId = "Doctor selection is required";
    }
    if (!formData.occupation) {
      errors.occupation = "Occupation is required";
    }
    if (!formData.emergencyContactName) {
      errors.emergencyContactName = "Emergency contact name is required";
    }
    if (!formData.emergencyPhoneNumber) {
      errors.emergencyPhoneNumber = "Emergency phone number is required";
    }
    if (!formData.primaryPhysician) {
      errors.primaryPhysician = "Primary physician is required";
    }
    if (!formData.insuranceProvider) {
      errors.insuranceProvider = "Insurance provider is required";
    }
    if (!formData.insurancePolicyNumber) {
      errors.insurancePolicyNumber = "Insurance policy number is required";
    }
    if (!formData.allergies) {
      errors.allergies = "Allergies are required";
    }
    if (!formData.currentMedications) {
      errors.currentMedications = "Current medications are required";
    }
    if (!formData.familyMedicalHistory) {
      errors.familyMedicalHistory = "Family medical history is required";
    }
    if (!formData.pastMedicalHistory) {
      errors.pastMedicalHistory = "Past medical history is required";
    }
    if (!formData.identificationType) {
      errors.identificationType = "Identification type is required";
    }
    if (!formData.identificationNumber) {
      errors.identificationNumber = "Identification number is required";
    }
    if (!formData.consentTreatment) {
      errors.consentTreatment = "Consent for treatment is required";
    }
    if (!formData.consentDisclosure) {
      errors.consentDisclosure = "Consent for disclosure is required";
    }
    if (!formData.privacyPolicy) {
      errors.privacyPolicy = "Privacy policy consent is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (validateForm()) {
      try {
        await createPatient(formData);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          dateOfBirth: "",
          gender: "Male",
          address: "",
          occupation: "",
          emergencyContactName: "",
          emergencyPhoneNumber: "",
          primaryPhysician: "",
          doctorId: "",
          insuranceProvider: "",
          insurancePolicyNumber: "",
          allergies: "",
          currentMedications: "",
          familyMedicalHistory: "",
          pastMedicalHistory: "",
          identificationType: "Birth Certificate",
          identificationNumber: "",
          consentTreatment: true,
          consentDisclosure: false,
          privacyPolicy: true,
        });
        navigate("/registration-success");
      } catch (error) {
        console.error("Error creating patient:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullName.trim()) {
        errors.fullName = "Full name is required";
        isValid = false;
      }

      if (!formData.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
        isValid = false;
      }

      if (step === 2) {
        if (!formData.doctorId) {
          errors.doctorId = "Doctor selection is required";
          isValid = false;
        }
      }

      if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = "Phone number is required";
        isValid = false;
      }

      if (!formData.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required";
        isValid = false;
      }
    } else if (step === 3) {
      if (!formData.identificationNumber.trim()) {
        errors.identificationNumber = "Identification number is required";
        isValid = false;
      }
    } else if (step === 4) {
      if (!formData.consentTreatment) {
        errors.consentTreatment = "You must consent to treatment";
        isValid = false;
      }

      if (!formData.privacyPolicy) {
        errors.privacyPolicy = "You must accept the privacy policy";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle doctor selection change
  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    const selectedDoctor = doctors.find(
      (doctor) => doctor._id === selectedDoctorId
    );

    if (selectedDoctor) {
      setFormData({
        ...formData,
        primaryPhysician: selectedDoctor.name,
        doctorId: selectedDoctor._id,
      });
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              onClick={() => setCurrentStep(i + 1)}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  i + 1 <= currentStep ? "bg-teal-600" : "bg-gray-300"
                } transition-colors duration-300 cursor-pointer`}
              >
                {i + 1 < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-6 sm:w-6 text-white"
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
                ) : (
                  <span
                    className={`${
                      i + 1 <= currentStep ? "text-white" : "text-gray-800"
                    } text-xs sm:text-base`}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-xs mt-1 hidden sm:inline ${
                  i + 1 <= currentStep ? "text-teal-500" : "text-gray-500"
                }`}
              >
                {i + 1 === 1 && "Personal"}
                {i + 1 === 2 && "Medical"}
                {i + 1 === 3 && "ID"}
                {i + 1 === 4 && "Consent"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 bg-gray-300 rounded-full">
          <div
            className="h-full bg-teal-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-800 pt-20 pb-0 md:pt-10 overflow-hidden">
      {/* Form Section */}
      <div className="flex-1 p-4 pt-6 pb-16 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Patient Registration
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Please fill out the form below to complete your registration.
            </p>
          </div>

          {renderProgressBar()}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="transition-opacity duration-300">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Personal Information
                  </h2>

                  <div className="mb-4 sm:mb-6">
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                      required
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="johndoe@example.com"
                          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                          required
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Phone number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          maxLength={10}
                          onChange={handleChange}
                          placeholder="(123) 456-7890"
                          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                          required
                        />
                        {formErrors.phoneNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Date of birth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                          required
                        />
                        {formErrors.dateOfBirth && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.dateOfBirth}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Gender
                      </label>
                      <div className="flex gap-2 sm:gap-3">
                        {["Male", "Female", "Other"].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender })}
                            className={`flex-1 p-2 sm:p-3 rounded transition text-xs sm:text-sm ${
                              formData.gender === gender
                                ? "bg-teal-600 text-white"
                                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <div
                                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border ${
                                  formData.gender === gender
                                    ? "border-white"
                                    : "border-gray-400"
                                } flex items-center justify-center`}
                              >
                                {formData.gender === gender && (
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span>{gender}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {formErrors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St, City, State - Zip"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                      />
                      {formErrors.occupation && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.occupation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Emergency contact name
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                      />
                      {formErrors.emergencyContactName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.emergencyContactName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Emergency phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          name="emergencyPhoneNumber"
                          value={formData.emergencyPhoneNumber}
                          maxLength={10}
                          onChange={handleChange}
                          placeholder="(123) 456-7890"
                          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                        />
                        {formErrors.emergencyPhoneNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.emergencyPhoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Medical Information */}
            {currentStep === 2 && (
              <div className="transition-opacity duration-300">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Medical Information
                  </h2>

                  <div className="mb-4 sm:mb-6">
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Primary care physician
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-600 flex items-center justify-center text-white">
                          <span className="text-xs">👨‍⚕️</span>
                        </div>
                      </div>
                      {isLoadingDoctors ? (
                        <div className="w-full p-2 sm:p-3 pl-10 sm:pl-12 rounded bg-white text-gray-400 border border-gray-300">
                          Loading doctors...
                        </div>
                      ) : (
                        <select
                          value={formData.doctorId}
                          onChange={handleDoctorChange}
                          className="w-full p-2 sm:p-3 pl-10 sm:pl-12 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition appearance-none text-sm sm:text-base"
                        >
                          {doctors.length > 0 ? (
                            doctors.map((doctor) => (
                              <option key={doctor._id} value={doctor._id}>
                                {doctor.name}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="">No doctors available</option>
                              <option value="default">Dr. Adam Smith</option>
                              <option value="default2">
                                Dr. Sarah Johnson
                              </option>
                              <option value="default3">Dr. Michael Lee</option>
                            </>
                          )}
                        </select>
                      )}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {formErrors.primaryPhysician && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.primaryPhysician}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Insurance provider
                      </label>
                      <input
                        type="text"
                        name="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={handleChange}
                        placeholder="BlueCross"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Insurance policy number
                      </label>
                      <input
                        type="text"
                        name="insurancePolicyNumber"
                        value={formData.insurancePolicyNumber}
                        onChange={handleChange}
                        placeholder="ABC1234567"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Allergies (if any)
                      </label>
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        placeholder="Peanuts, Penicillin, Pollen"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition h-20 sm:h-24 text-sm sm:text-base"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Current medications
                      </label>
                      <textarea
                        name="currentMedications"
                        value={formData.currentMedications}
                        onChange={handleChange}
                        placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition h-20 sm:h-24 text-sm sm:text-base"
                      ></textarea>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Family medical history
                      </label>
                      <textarea
                        name="familyMedicalHistory"
                        value={formData.familyMedicalHistory}
                        onChange={handleChange}
                        placeholder="Mother had breast cancer"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition h-20 sm:h-24 text-sm sm:text-base"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                        Past medical history
                      </label>
                      <textarea
                        name="pastMedicalHistory"
                        value={formData.pastMedicalHistory}
                        onChange={handleChange}
                        placeholder="Asthma diagnosis in childhood"
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition h-20 sm:h-24 text-sm sm:text-base"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Identification and Verification */}
            {currentStep === 3 && (
              <div className="transition-opacity duration-300">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Identification and Verification
                  </h2>

                  <div className="mb-4 sm:mb-6">
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Identification type
                    </label>
                    <div className="relative">
                      <select
                        name="identificationType"
                        value={formData.identificationType}
                        onChange={handleChange}
                        className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition appearance-none text-sm sm:text-base"
                      >
                        <option value="Birth Certificate">
                          Birth Certificate
                        </option>
                        <option value="Driver's License">
                          Driver's License
                        </option>
                        <option value="Passport">Passport</option>
                        <option value="State ID">State ID</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Identification Number
                    </label>
                    <input
                      type="text"
                      name="identificationNumber"
                      value={formData.identificationNumber}
                      onChange={handleChange}
                      placeholder="1234567"
                      className="w-full p-2 sm:p-3 rounded bg-white text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition text-sm sm:text-base"
                    />
                  </div>
{/* 
                  <div className="mb-4 sm:mb-6">
                    <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                      Upload Identification Document
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-teal-500 transition cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 sm:h-12 sm:w-12 text-teal-500 mb-2 sm:mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-teal-500 font-medium mb-1 text-sm sm:text-base">
                          Click to upload
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm mb-1">
                          or drag and drop
                        </p>
                        <p className="text-gray-500 text-xs">
                          SVG, PNG, JPG or PDF (max. 5MB)
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {/* Step 4: Consent and Privacy */}
            {currentStep === 4 && (
              <div className="transition-opacity duration-300">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Consent and Privacy
                  </h2>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 border border-gray-300 rounded-md hover:border-teal-500 transition">
                      <label className="flex items-start cursor-pointer">
                        <div className="flex h-5 sm:h-6 items-center">
                          <input
                            type="checkbox"
                            name="consentTreatment"
                            checked={formData.consentTreatment}
                            onChange={handleChange}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                        </div>
                        <div className="ml-3 text-sm sm:text-base">
                          <span className="font-medium">
                            Consent to Treatment
                          </span>
                          <p className="text-gray-600">
                            I consent to receive treatment for my health
                            condition from the medical providers at this
                            facility.
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="p-3 sm:p-4 border border-gray-300 rounded-md hover:border-teal-500 transition">
                      <label className="flex items-start cursor-pointer">
                        <div className="flex h-5 sm:h-6 items-center">
                          <input
                            type="checkbox"
                            name="consentDisclosure"
                            checked={formData.consentDisclosure}
                            onChange={handleChange}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                        </div>
                        <div className="ml-3 text-sm sm:text-base">
                          <span className="font-medium">
                            Consent to Disclosure
                          </span>
                          <p className="text-gray-600">
                            I consent to the disclosure of my medical
                            information for treatment purposes.
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="p-3 sm:p-4 border border-gray-300 rounded-md hover:border-teal-500 transition">
                      <label className="flex items-start cursor-pointer">
                        <div className="flex h-5 sm:h-6 items-center">
                          <input
                            type="checkbox"
                            name="privacyPolicy"
                            checked={formData.privacyPolicy}
                            onChange={handleChange}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                        </div>
                        <div className="ml-3 text-sm sm:text-base">
                          <span className="font-medium">Privacy Policy</span>
                          <p className="text-gray-600">
                            I have read and agree to the privacy policy of this
                            facility.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center p-4 sm:p-5 border border-gray-300 rounded-lg bg-gray-50">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex px-4 py-2 rounded bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-500 transition"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-500 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modified Image Section */}
      <div className="hidden md:block w-1/3 h-90vh overflow-hidden">
        <img
          src={patientform}
          alt="Patient registration background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PatientDetailForm;
