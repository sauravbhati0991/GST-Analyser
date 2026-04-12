import { useEffect, useState } from 'react';

const STEPS = [
  { id: 'upload', label: 'Reading document' },
  { id: 'extract', label: 'Extracting data' },
  { id: 'validate', label: 'Validating GST info' },
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setActiveStep(1), 1500);
    const t2 = setTimeout(() => setActiveStep(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="text-center py-16 px-6 animate-fade-in-up">
      {/* Spinner */}
      <div className="w-20 h-20 mx-auto mb-8 relative">
        <div className="w-full h-full rounded-full border-[3px] border-white/[0.06] border-t-indigo-500 border-r-purple-500 animate-spin-loader" />
      </div>

      <h3 className="text-xl font-semibold mb-1.5">Analysing your bill...</h3>
      <p className="text-sm text-gray-500 mb-8">AI is reading and extracting information</p>

      {/* Steps */}
      <div className="flex flex-col items-center gap-3">
        {STEPS.map((step, i) => {
          const isDone = i < activeStep;
          const isActive = i === activeStep;

          return (
            <div key={step.id} className={`flex items-center gap-2.5 text-sm transition-colors duration-300 ${isDone ? 'text-green-400' : isActive ? 'text-indigo-400' : 'text-gray-600'
              }`}>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isDone ? 'bg-green-400' : isActive ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] animate-pulse-dot' : 'bg-gray-600'
                }`} />
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
