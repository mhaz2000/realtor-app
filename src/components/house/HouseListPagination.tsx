import React from 'react';

type PaginationProps = {
  page: number;
  hasMore: boolean;
  onNext: () => void;
  onPrevious: () => void;
};

const HouseListPagination: React.FC<PaginationProps> = ({ page, hasMore, onNext, onPrevious }) => {
  return (
    <nav aria-label="Pagination" className="flex justify-center items-center gap-6 mt-8">
      <button
        onClick={onPrevious}
        disabled={page === 1}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full
          border border-gray-300
          bg-white
          shadow-md
          transition
          duration-300
          hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600 hover:text-white
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500
          focus:outline-none focus:ring-4 focus:ring-blue-300
        `}
        aria-label="Previous Page"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span className="text-gray-800 font-semibold text-lg px-4 py-2 rounded-full border border-blue-500 bg-blue-100 select-none shadow-md">
        {page}
      </span>

      <button
        onClick={onNext}
        disabled={!hasMore}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full
          border border-gray-300
          bg-white
          shadow-md
          transition
          duration-300
          hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600 hover:text-white
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500
          focus:outline-none focus:ring-4 focus:ring-blue-300
        `}
        aria-label="Next Page"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
};

export default HouseListPagination;
