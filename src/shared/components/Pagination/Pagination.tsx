import { type ChangeEvent } from 'react';

import { Icon } from '../Icon/Icon';

import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button
        className="pagination__prev"
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <Icon name="arrow-l" width={18} height={18} />
      </button>

      <span className="pagination__center-wrapp">
        <input
          className="pagination__input"
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={handleInputChange}
          aria-label="Current page"
        />
        <span className="pagination__divider"> / </span>
        <span className="pagination__total">{totalPages}</span>
      </span>

      <button
        className="pagination__next"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <Icon name="arrow-r" width={18} height={18} />
      </button>
    </div>
  );
}
