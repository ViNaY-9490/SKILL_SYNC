'use client';

import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-[#173F35] text-[#FCFBF7] hover:bg-[#12322A] focus:ring-[#173F35] shadow-sm',
      secondary: 'bg-[#256B58] text-[#FCFBF7] hover:bg-[#1D5445] focus:ring-[#256B58] shadow-sm',
      outline: 'border border-[#DDE2DC] bg-[#FCFBF7] text-[#17231F] hover:bg-[#F7F5EF] focus:ring-[#A7BDAF]',
      ghost: 'bg-transparent text-[#17231F] hover:bg-[#F0EDE6] focus:ring-[#A7BDAF]',
      accent: 'bg-[#E38B32] text-[#FCFBF7] hover:bg-[#C97928] focus:ring-[#E38B32] shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
