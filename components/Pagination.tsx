import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageButton: React.FC<{
  onClick?: () => void;
  isDisabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isDisabled, isActive, children }) => {
  const baseClasses = "w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-primary focus:ring-gray-800 dark:focus:ring-white";
  
  const activeClasses = "bg-white text-black scale-110 shadow-lg";
  const inactiveClasses = "bg-background-tertiary text-text-secondary hover:bg-opacity-80";
  const disabledClasses = "text-text-muted cursor-not-allowed bg-background-secondary";

  let finalClasses = `${baseClasses} `;
  if (isDisabled) {
    finalClasses += disabledClasses;
  } else if (isActive) {
    finalClasses += activeClasses;
  } else {
    finalClasses += inactiveClasses;
  }

  return (
    <button onClick={onClick} disabled={isDisabled} className={finalClasses}>
      {children}
    </button>
  );
};

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= maxPagesToShow - 1) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage > totalPages - (maxPagesToShow - 1)) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-2 mt-12">
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </PageButton>
      
      {pageNumbers.map((num, index) =>
        num === '...' ? (
          <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-text-muted">
            ...
          </span>
        ) : (
          <PageButton
            key={num}
            onClick={() => onPageChange(num as number)}
            isActive={currentPage === num}
          >
            {num}
          </PageButton>
        )
      )}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </PageButton>
    </nav>
  );
};

export const Pagination = React.memo(PaginationComponent);