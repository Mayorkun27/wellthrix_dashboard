import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterSteps from './RegisterSteps';
import StepOne from './registersteps/StepOne';
import StepTwo from './registersteps/StepTwo';
import StepThree from './registersteps/StepThree';
import StepFour from './registersteps/StepFour';
import StepFive from './registersteps/StepFive';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [sessionId, setSessionId] = useState(null);

  const handleNextStep = (newSessionId = null) => {
    if (newSessionId) {
      setSessionId(newSessionId);
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="w-full mx-auto">
      <RegisterSteps currentStep={step} />
      
      <div>
        {step === 1 && (
          <StepOne
            nextStep={handleNextStep}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {step === 2 && (
          <StepTwo
            nextStep={handleNextStep}
            prevStep={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            sessionId={sessionId}          
          />
        )}
        {step === 3 && (
          <StepThree
            nextStep={handleNextStep}
            prevStep={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            sessionId={sessionId}
          />
        )}
        {step === 4 && (
          <StepFour
            nextStep={handleNextStep}
            prevStep={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            sessionId={sessionId}
          />
        )}
        {step === 5 && (
          <StepFive
            prevStep={prevStep}
            formData={formData}
            updateFormData={updateFormData}
            sessionId={sessionId}
          />
        )}
      </div>
    </div>
  );
};

export default Register;