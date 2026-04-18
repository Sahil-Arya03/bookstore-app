/**
 * Pagination component for navigating paginated data.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible);

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  for (let i = start; i < end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-dark-600 hover:bg-primary-50 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        ← Prev
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
            page === currentPage
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
              : 'bg-white border border-gray-200 text-dark-600 hover:bg-primary-50 hover:border-primary-300'
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-dark-600 hover:bg-primary-50 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
