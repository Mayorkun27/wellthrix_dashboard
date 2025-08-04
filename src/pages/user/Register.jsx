import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import RegisterSteps from './RegisterSteps';
import StepOne from './registersteps/StepOne';
import StepTwo from './registersteps/StepTwo';
import StepThree from './registersteps/StepThree';
import StepFour from './registersteps/StepFour';
import StepFive from './registersteps/StepFive';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="w-full mx-auto py-6">
      <RegisterSteps currentStep={step} />
      
      <div>
        {step === 1 && <StepOne nextStep={nextStep} formData={formData} updateFormData={updateFormData} />}
        {step === 2 && <StepTwo nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />}
        {step === 3 && <StepThree nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />}
        {step === 4 && <StepFour nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />}
        {step === 5 && <StepFive prevStep={prevStep} formData={formData} />}
      </div>
    </div>
  );
};

export default Register;