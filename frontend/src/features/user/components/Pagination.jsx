import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <nav className="flex justify-center items-center mt-4">
      <button
        onClick={() => onPageChange('previous')}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="px-3 py-1 mx-1">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange('next')}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50"
      >
        Siguiente
      </button>
    </nav>
  );
};

export default Pagination;
