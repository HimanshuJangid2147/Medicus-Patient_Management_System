import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function VerificationPopup({
                                            isOpen = false,
                                            onClose = () => {},
                                            onSubmit = () => {},
                                            title = "Access Verification",
                                            message = "Please enter the verification code",
                                            buttonText = "Submit",
                                            digits = 6,
                                            initialValues = [],
                                            highlightedDigits = 0,
                                            highlightColor = "bg-teal-500 border-teal-400",
                                            regularColor = "bg-white border-gray-300"
                                          }) {
  const [passcode, setPasscode] = useState(Array(digits).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (initialValues && initialValues.length > 0) {
      const newPasscode = [...passcode];
      initialValues.forEach((value, index) => {
        if (index < digits) newPasscode[index] = value.toString();
      });
      setPasscode(newPasscode);
    }
  }, [initialValues, digits]);

  const handleDigitChange = (index, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return;
    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);
    if (value !== '' && index < digits - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && passcode[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < digits - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => onSubmit(passcode.join(''));

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <p className="mb-6 text-gray-600">{message}</p>

          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: digits }, (_, i) => (
                <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={passcode[i]}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-12 h-12 text-center text-2xl font-bold rounded-md 
                ${i < highlightedDigits ? highlightColor : regularColor} 
                border-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800`}
                    aria-label={`Digit ${i + 1}`}
                />
            ))}
          </div>

          <button
              onClick={handleSubmit}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 rounded-md text-white font-medium transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
  );
}