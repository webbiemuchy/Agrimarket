import clsx from 'clsx';

const Card = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  hover = true,
  variant = 'default',
  border = 'default',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const shadowClasses = {
    none: '',
    xs: 'shadow-xs',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    '3xl': 'shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]'
  };

  const variantClasses = {
    default: 'bg-white',
    gradient: 'bg-gradient-to-br from-white to-gray-50',
    glass: 'bg-white/90 backdrop-blur-sm',
    green: 'bg-gradient-to-br from-green-50 to-green-100',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100'
  };

  const borderClasses = {
    none: 'border-0',
    default: 'border border-gray-200',
    green: 'border border-green-200',
    blue: 'border border-blue-200',
    purple: 'border border-purple-200',
    orange: 'border border-orange-200'
  };

  const hoverClasses = hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]' : '';

  return (
    <div
      className={clsx(
        'rounded-2xl overflow-hidden transform',
        paddingClasses[padding],
        shadowClasses[shadow],
        variantClasses[variant],
        borderClasses[border],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
