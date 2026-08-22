/**
 * StepIndicator — Visual progress indicator for multi-step forms
 *
 * Renders a horizontal step bar with completed/current/upcoming states.
 * Follows DWS brand dark theme tokens.
 */

import React from 'react';

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentIndex: number;
  onStepClick?: (stepId: string) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentIndex,
  onStepClick,
}) => {
  return (
    <nav aria-label="Form progress" className="w-full">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = onStepClick && index <= currentIndex;

          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                className={`
                  flex items-center gap-2 text-sm font-medium transition-colors
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  ${isCurrent ? 'text-primary-400' : ''}
                  ${isCompleted ? 'text-green-400' : ''}
                  ${!isCurrent && !isCompleted ? 'text-fg-muted' : ''}
                `}
              >
                {/* Step number / check */}
                <span
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold
                    transition-all duration-200
                    ${isCurrent ? 'bg-primary-600 text-white ring-2 ring-primary-400/30' : ''}
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${!isCurrent && !isCompleted ? 'bg-fg-muted/20 text-fg-muted' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Label — hidden on small screens */}
                <span className="hidden sm:inline">{step.label}</span>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 transition-colors
                    ${isCompleted ? 'bg-green-600' : 'bg-fg-muted/20'}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
