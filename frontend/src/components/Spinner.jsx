/**
 * Loading spinner component with animation.
 * @param {string} size - 'sm', 'md', or 'lg'
 */
const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-dark-500 text-sm animate-pulse-soft">{text}</p>}
    </div>
  );
};

export default Spinner;
