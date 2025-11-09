interface Step {
  number: number;
  title: string;
  subtitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-8 left-0 right-0 h-0.5 bg-luxury-charcoal-light/20">
        <div
          className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light transition-all duration-700 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center group"
              style={{ width: `${100 / steps.length}%` }}
            >
              {/* Circle */}
              <div
                className={`
                  relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                  ${
                    isActive
                      ? 'bg-luxury-gold shadow-lg shadow-luxury-gold/50 scale-110'
                      : isCompleted
                      ? 'bg-luxury-gold/80'
                      : 'bg-luxury-charcoal-light'
                  }
                `}
              >
                {isCompleted ? (
                  // Checkmark for completed steps
                  <svg
                    className="w-8 h-8 text-luxury-charcoal animate-scale-in"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  // Number for current and upcoming steps
                  <span
                    className={`
                      text-xl font-bold transition-colors duration-300
                      ${
                        isActive
                          ? 'text-luxury-charcoal'
                          : isUpcoming
                          ? 'text-luxury-silver/50'
                          : 'text-luxury-charcoal'
                      }
                    `}
                  >
                    {step.number}
                  </span>
                )}

                {/* Active pulse animation */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-luxury-gold animate-ping opacity-20" />
                )}
              </div>

              {/* Label */}
              <div
                className={`
                  mt-4 text-center transition-all duration-300
                  ${isActive ? 'opacity-100' : 'opacity-60'}
                `}
              >
                <p
                  className={`
                    text-sm font-semibold transition-colors duration-300
                    ${
                      isActive
                        ? 'text-luxury-platinum'
                        : isCompleted
                        ? 'text-luxury-gold'
                        : 'text-luxury-silver'
                    }
                  `}
                >
                  {step.title}
                </p>
                <p className="text-xs text-luxury-silver/70 mt-0.5 hidden sm:block">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
