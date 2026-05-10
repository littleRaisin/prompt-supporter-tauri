type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
};

const Button = ({
  text,
  type = 'button',
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) => {
  const base = 'px-3 py-1 rounded';
  const styles =
    variant === 'secondary'
      ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
      : variant === 'danger'
        ? 'bg-red-500 text-white hover:bg-red-600'
        : 'bg-blue-500 text-white hover:bg-blue-600';

  return (
    <button
      type={type}
      className={`${base} ${styles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
