/**
 * Button Component - Gamma UI Guidelines
 *
 * Demonstrates:
 * - No arbitrary Tailwind values
 * - Proper accessibility (aria-label when needed)
 * - CSS hover states (no JavaScript)
 * - Transition on compositor props only (opacity)
 * - AlertDialog for destructive actions
 */

import { cn } from '@/lib/utils';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  destructive?: boolean;
  destructiveMessage?: string;
  onDestructiveConfirm?: () => void;
  children: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  destructive = false,
  destructiveMessage,
  onDestructiveConfirm,
  className,
  children,
  ...props
}: ButtonProps) {
  // Base styles - mobile-first, no arbitrary values
  const baseStyles = cn(
    // Layout
    'inline-flex items-center justify-center',
    'font-medium',
    'rounded-md',
    'border border-transparent',
    // Accessibility
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    // Transitions - opacity only (compositor prop)
    'transition-opacity',
    // Disabled state
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  // Size variants - using Tailwind defaults only
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  // Variant styles - following Gamma color palette
  const variantStyles = {
    primary: cn(
      'bg-blue-500 text-white',
      'hover:opacity-90',
      'focus:ring-blue-400'
    ),
    secondary: cn(
      'bg-slate-600 text-white',
      'hover:opacity-90',
      'focus:ring-slate-400'
    ),
    destructive: cn(
      'bg-red-600 text-white',
      'hover:opacity-90',
      'focus:ring-red-400'
    ),
    ghost: cn(
      'bg-transparent text-slate-700',
      'hover:opacity-70',
      'focus:ring-slate-400'
    ),
  }[destructive ? 'destructive' : variant];

  const buttonContent = (
    <button
      className={cn(baseStyles, sizeStyles, variantStyles, className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          {/* Loading spinner - transforms only (compositor prop) */}
          <svg
            className="animate-spin -ml-1 mr-2 size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );

  // Wrap with AlertDialog for destructive actions
  if (destructive && onDestructiveConfirm) {
    return (
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>{buttonContent}</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-lg shadow-xl p-6 z-50">
            <AlertDialog.Title className="text-balance text-lg font-semibold text-slate-900 mb-2">
              Are you sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-pretty text-sm text-slate-600 mb-6">
              {destructiveMessage ||
                'This action cannot be undone. This will permanently delete the data.'}
            </AlertDialog.Description>
            <div className="flex gap-3 justify-end">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:opacity-90 transition-opacity">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={onDestructiveConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  }

  return buttonContent;
}

// ============================================================================
// Usage Examples
// ============================================================================

export function ButtonExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Button Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Button Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Loading State
        </h2>
        <Button isLoading>Processing...</Button>
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Destructive Action (with AlertDialog)
        </h2>
        <Button
          destructive
          destructiveMessage="This will permanently delete your project and all associated data. This action cannot be undone."
          onDestructiveConfirm={() => alert('Project deleted')}
        >
          Delete Project
        </Button>
      </section>

      <section>
        <h2 className="text-balance text-2xl font-bold mb-4 text-slate-900">
          Icon Button (with aria-label)
        </h2>
        <button
          className="inline-flex items-center justify-center size-10 rounded-md bg-blue-500 text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Delete item"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </section>
    </div>
  );
}
