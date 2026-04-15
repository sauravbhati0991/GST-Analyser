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
    <div className="text-center py-20 px-6 animate-fade-in-up">
      {/* Spinner */}
      <div className="w-24 h-24 mx-auto mb-10 relative">
        <div className="w-full h-full rounded-full border-[4px] border-bg-primary border-t-accent border-r-accent/30 animate-spin-loader shadow-lg" />
      </div>

      <h3 className="text-2xl font-extrabold text-text-primary mb-2">Analysing your bill...</h3>
      <p className="text-base text-text-secondary mb-10 font-medium">AI is reading and extracting information</p>

      {/* Steps */}
      <div className="flex flex-col items-center gap-4">
        {STEPS.map((step, i) => {
          const isDone = i < activeStep;
          const isActive = i === activeStep;

          return (
            <div key={step.id} className={`flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${isDone ? 'text-accent' : isActive ? 'text-text-primary' : 'text-text-secondary'
              }`}>
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isDone ? 'bg-accent shadow-[0_0_10px_rgba(0,168,120,0.4)]' : isActive ? 'bg-text-primary animate-pulse-dot shadow-[0_0_12px_rgba(27,37,75,0.3)]' : 'bg-border-light'
                }`} />
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
