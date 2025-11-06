import React, { useState } from 'react';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-background-tertiary">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-5"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">{title}</h3>
        <ChevronRightIcon 
          className={`w-6 h-6 text-gray-500 dark:text-text-muted transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <div className="pb-5 text-gray-600 dark:text-text-secondary">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};