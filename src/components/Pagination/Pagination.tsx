import { FC, useState } from 'react';

import './Pagination.css';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  changePage: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({ totalItems, itemsPerPage, changePage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const onPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      changePage(newPage);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(event.target.value, 10);
    onPageChange(newPage);
  };

  return (
    <div className="pagination">
      <button
        className="pagination__prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        🠈
      </button>

      <span className="pagination__center-wrapp">
        <input
          className="pagination__input"
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={handleInputChange}
        />
        <span className="pagination__divider"> / </span>
        <span className="pagination__current">{totalPages}</span>
      </span>

      <button
        className="pagination__next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        🠊
      </button>
    </div>
  );
};
