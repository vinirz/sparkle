'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: (value: string) => string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordType = type === 'password';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (mask) {
        const maskedValue = mask(event.target.value);
        event.target.value = maskedValue;
      }

      if (onChange) {
        onChange(event);
      }
    };

    return (
      <div className="relative w-full">
        <input
          type={isPasswordType && showPassword ? 'text' : type}
          className={cn(
            'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:ring-ring focus-visible:outline-none',
            'dark:bg-input/30 disabled:cursor-not-allowed disabled:opacity-50',
            isPasswordType && 'pr-10',
            className,
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };