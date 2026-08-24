/**
 * useMultiStepForm — Multi-step form hook with conditional logic
 *
 * Handles step navigation, field-level validation via Zod schemas,
 * conditional step visibility, and form state persistence.
 *
 * Usage:
 *   const form = useMultiStepForm({
 *     steps: [
 *       { id: 'basics', label: 'Basic Info', schema: basicSchema },
 *       { id: 'emissions', label: 'Emissions', schema: emissionsSchema,
 *         showWhen: (data) => data.basics.hasEmissionsData === true },
 *       { id: 'review', label: 'Review' },
 *     ],
 *   });
 */

import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';

// ============ TYPES ============

export interface StepDefinition<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Unique step identifier */
  id: string;
  /** Human-readable step label */
  label: string;
  /** Optional Zod schema for step validation */
  schema?: z.ZodType;
  /** Conditional visibility — step is skipped if this returns false */
  showWhen?: (data: T) => boolean;
}

export interface MultiStepFormOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  steps: StepDefinition<T>[];
  /** Initial form data (for resuming or editing) */
  initialData?: Partial<T>;
  /** Called when the final step is submitted */
  onSubmit?: (data: T) => void | Promise<void>;
}

export interface MultiStepFormReturn<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Current visible step index (0-based, accounts for hidden steps) */
  currentStepIndex: number;
  /** Current step definition */
  currentStep: StepDefinition<T>;
  /** All visible steps (after conditional filtering) */
  visibleSteps: StepDefinition<T>[];
  /** Total visible steps count */
  totalSteps: number;
  /** Full form data across all steps */
  data: T;
  /** Validation errors for current step */
  errors: Record<string, string>;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Whether we're on the first visible step */
  isFirstStep: boolean;
  /** Whether we're on the last visible step */
  isLastStep: boolean;
  /** Progress percentage (0-100) */
  progress: number;

  /** Update a field value */
  setField: (stepId: string, field: string, value: unknown) => void;
  /** Update multiple fields at once */
  setFields: (stepId: string, fields: Record<string, unknown>) => void;
  /** Go to next step (validates current step first) */
  next: () => boolean;
  /** Go to previous step */
  back: () => void;
  /** Jump to a specific step by id */
  goTo: (stepId: string) => void;
  /** Validate current step without advancing */
  validate: () => boolean;
  /** Submit the form (validates all steps) */
  submit: () => Promise<boolean>;
  /** Reset form to initial state */
  reset: () => void;
}

// ============ HOOK ============

export function useMultiStepForm<T extends Record<string, unknown> = Record<string, unknown>>(
  options: MultiStepFormOptions<T>,
): MultiStepFormReturn<T> {
  const { steps, initialData, onSubmit } = options;

  const [data, setData] = useState<T>((initialData || {}) as T);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter steps based on conditional logic
  const visibleSteps = useMemo(() => {
    return steps.filter((step) => !step.showWhen || step.showWhen(data));
  }, [steps, data]);

  // Clamp current index to visible range
  const safeIndex = Math.min(currentIndex, visibleSteps.length - 1);
  const currentStep = visibleSteps[safeIndex];

  const setField = useCallback((stepId: string, field: string, value: unknown) => {
    setData((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] as Record<string, unknown> || {}),
        [field]: value,
      },
    } as T));
    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setFields = useCallback((stepId: string, fields: Record<string, unknown>) => {
    setData((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] as Record<string, unknown> || {}),
        ...fields,
      },
    } as T));
  }, []);

  const validateStep = useCallback((step: StepDefinition<T>): boolean => {
    if (!step.schema) return true;

    const stepData = (data[step.id as keyof T] || {}) as Record<string, unknown>;
    const result = step.schema.safeParse(stepData);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Record<string, string> = {};
    if ('error' in result && result.error) {
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
    }
    setErrors(fieldErrors);
    return false;
  }, [data]);

  const validate = useCallback(() => {
    return validateStep(currentStep);
  }, [currentStep, validateStep]);

  const next = useCallback(() => {
    if (!validateStep(currentStep)) return false;
    if (safeIndex < visibleSteps.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
    return true;
  }, [currentStep, safeIndex, visibleSteps.length, validateStep]);

  const back = useCallback(() => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setErrors({});
    }
  }, [safeIndex]);

  const goTo = useCallback((stepId: string) => {
    const idx = visibleSteps.findIndex((s) => s.id === stepId);
    if (idx >= 0) {
      setCurrentIndex(idx);
      setErrors({});
    }
  }, [visibleSteps]);

  const submit = useCallback(async () => {
    // Validate all visible steps
    for (const step of visibleSteps) {
      if (!validateStep(step)) {
        const idx = visibleSteps.indexOf(step);
        setCurrentIndex(idx);
        return false;
      }
    }

    if (!onSubmit) return true;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      return true;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [visibleSteps, validateStep, onSubmit, data]);

  const reset = useCallback(() => {
    setData((initialData || {}) as T);
    setCurrentIndex(0);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    currentStepIndex: safeIndex,
    currentStep,
    visibleSteps,
    totalSteps: visibleSteps.length,
    data,
    errors,
    isSubmitting,
    isFirstStep: safeIndex === 0,
    isLastStep: safeIndex === visibleSteps.length - 1,
    progress: visibleSteps.length > 1 ? Math.round((safeIndex / (visibleSteps.length - 1)) * 100) : 100,
    setField,
    setFields,
    next,
    back,
    goTo,
    validate,
    submit,
    reset,
  };
}
