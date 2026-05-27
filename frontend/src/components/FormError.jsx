const FormError = ({ message, className = "" }) => {
  if (!message) return null;

  return <p className={`text-sm text-red-600 ${className}`}>{message}</p>;
};

export default FormError;
