import React from 'react';

const ProductTable = ({ products }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Código</th>
          <th className="py-2">Nombre</th>
          <th className="py-2">Categoría</th>
          <th className="py-2">Tipo</th>
          <th className="py-2">Usuario</th>
          <th className="py-2">Comentarios</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="border px-4 py-2">{product.code}</td>
            <td className="border px-4 py-2">{product.name}</td>
            <td className="border px-4 py-2">{product.category?.name}</td>
            <td className="border px-4 py-2">{product.type?.name}</td>
            <td className="border px-4 py-2">{product.user}</td>
            <td className="border px-4 py-2">
              {product.comments.length > 0
                ? product.comments.map((comment) => <p key={comment.id}>{comment.text}</p>)
                : 'Sin comentarios'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
