import React from 'react';

const TypeToolbar = ({ onSearch, onCreate }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      {/* Crear nuevo tipo */}
      <button
        onClick={onCreate}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Nuevo Tipo
      </button>

      {/* Buscar tipo */}
      <div className="relative">
        <input
          type="text"
          className="block pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar Tipo"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TypeToolbar;
