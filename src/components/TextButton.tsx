import type { ReactNode } from 'react';

type TextButtonProps = {
  onClick?: () => void;
  children: ReactNode;
};

const TextButton = ({ onClick, children }: TextButtonProps) => (
  <span
    className="cursor-pointer hover:opacity-60 transition-opacity duration-200 ease-in-out"
    onClick={onClick}
  >
    {children}
  </span>
);

export default TextButton;
