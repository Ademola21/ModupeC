
import React from 'react';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const FormButton: React.FC<FormButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg transition-[transform,background-opacity] duration-300 transform hover:scale-105 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-secondary focus:ring-white"
    >
      {children}
    </button>
  );
};
