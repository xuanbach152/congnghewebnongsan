import { memo } from 'react'
import './arrowPagination.scss'

const ArrowPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="arrow-pagination">
      <button
        className="arrow left"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
      <button
        className="arrow right"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  )
}

export default memo(ArrowPagination)
