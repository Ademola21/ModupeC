import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full bg-background-tertiary/80 border-2 border-transparent rounded-lg py-3 px-4 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300"
      />
    </div>
  );
};
