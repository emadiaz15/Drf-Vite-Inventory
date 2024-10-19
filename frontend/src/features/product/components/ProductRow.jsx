// src/components/ProductRow.js
import React from 'react';

const ProductRow = ({ product }) => {
  return (
    <tr>
      <td className="py-2 px-4 border-b">{product.code}</td>
      <td className="py-2 px-4 border-b">{product.name}</td>
      <td className="py-2 px-4 border-b">{product.category?.name || 'Sin categoría'}</td>
      <td className="py-2 px-4 border-b">{product.brand?.name || 'Sin marca'}</td>
      <td className="py-2 px-4 border-b">{product.type?.name || 'Sin tipo'}</td>
    </tr>
  );
};

export default ProductRow;
