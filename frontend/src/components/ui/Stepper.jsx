//frontend/src/components/ui/Stepper.jsx
const Stepper = ({ steps, currentStep, labels }) => {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: steps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === index + 1 
                ? 'bg-emerald-600 text-white' 
                : currentStep > index + 1 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-gray-200 text-gray-500'
            }`}
          >
            {currentStep > index + 1 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < steps - 1 && (
            <div className={`w-16 h-1 ${currentStep > index + 1 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
      
      <div className="absolute mt-10 w-full flex justify-between">
        {labels.map((label, index) => (
          <span 
            key={index} 
            className={`text-xs ${currentStep === index + 1 ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}
            style={{ marginLeft: `${index * 24}%` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Stepper;