import React, { useEffect, useState } from 'react';
import RegisterSteps from './RegisterSteps';
import StepOne from './registersteps/StepOne';
import StepTwo from './registersteps/StepTwo';
import StepThree from './registersteps/StepThree';
import StepFour from './registersteps/StepFour';
import StepFive from './registersteps/StepFive';
import StepSix from './registersteps/StepSix';

// Define step components mapping
const steps = {
  1: StepOne,
  2: StepTwo,
  3: StepThree,
  4: StepFour,
  5: StepFive,
  6: StepSix,
};

const Register = () => {
  const [step, setStep] = useState(3);
  const [formData, setFormData] = useState({});
  const [sessionId, setSessionId] = useState(null);

  // In Register
  useEffect(() => {
    if (sessionId) localStorage.setItem('registrationSessionId', sessionId);
  }, [sessionId]);

  // Load on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('registrationSessionId');
    if (savedSessionId) setSessionId(savedSessionId);
  }, []);

 const handleNextStep = (newSessionId = null) => {
    if (newSessionId) {
      // console.log('Register updating sessionId:', newSessionId);
      setSessionId(newSessionId);
    }
    setStep((prev) => Math.min(prev + 1, Object.keys(steps).length));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const CurrentStep = steps[step];

  return (
    <div className="w-full mx-auto">
      <RegisterSteps currentStep={step} />
      <CurrentStep
        nextStep={handleNextStep}
        prevStep={prevStep}
        formData={formData}
        updateFormData={updateFormData}
        sessionId={sessionId}
      />
    </div>
  );
};

export default Register;