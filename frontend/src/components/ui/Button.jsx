//frontend/src/components/ui/Button.jsx

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react'; 
import clsx from 'clsx';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500",
    accent: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400",
    danger:    "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    destructive: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400", 
    outline:   "border border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost:     "text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500"
   };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      ref={ref}
      {...props} 
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  );
});

export default Button;

