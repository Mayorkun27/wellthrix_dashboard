import React from 'react';

const RegisterSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, name: 'Pick Your Products' },
    { number: 2, name: 'Contact Information' },
    { number: 3, name: 'Login Information' },
    { number: 4, name: 'Overview' },
    { number: 5, name: 'Payment' }
  ];

  return (
    <div className="w-full pb-6 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-between relative min-w-[600px] whitespace-nowrap">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center z-10 relative w-[120px] shrink-0">
              {/* Circle with number */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl
                 ${currentStep >= step.number ? 'bg-pryClr text-white' : 'bg-black/20 text-black/30'}
                font-semibold`}>
                {step.number}
              </div>
              
              {/* Step name */}
              <span className={`mt-2 text-xs md:text-sm text-center 
                ${currentStep > step.number ? 'font-bold text-pryClr' : ''}
                ${currentStep === step.number ? 'font-bold text-pryClr' : ''}
                ${currentStep < step.number ? 'text-black/30' : ''}`}>
                {step.name}
              </span>
            </div>

            {/* Connecting line (except after last step) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-1 mb-4 min-w-[20px]">
                <div className={`h-1 w-full
                  ${currentStep > step.number ? 'bg-pryClr' : 'bg-gray-200'}`}>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RegisterSteps;