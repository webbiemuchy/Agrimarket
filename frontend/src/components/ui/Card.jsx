
//frontend/src/components/ui/Card.jsx
import clsx from 'clsx';

const Card = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg'
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl overflow-hidden',
        paddingClasses[padding],
        shadowClasses[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

