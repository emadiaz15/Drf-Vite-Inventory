// src/features/product/components/ProductEditModal.jsx
import React, { useState } from 'react';
import { updateProduct } from '../services/products/updateProduct';
import SuccessMessage from '../../../components/common/SuccessMessage';

const ProductEditModal = ({ product, onClose, onSave }) => {
  const [productData, setProductData] = useState({
    name: product.name,
    code: product.code,
    category: product.category.id, // Assuming category and type are objects
    type: product.type.id,
    description: product.description,
    brand: product.brand ? product.brand.id : '',
    stock_quantity: product.stock_quantity || 0,
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(product.id, productData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSave(); // Recargar la lista de productos
        onClose(); // Cerrar el modal
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      setError('No se pudo actualizar el producto. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-2xl mb-4">Editar Producto</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Código</label>
            <input
              type="text"
              name="code"
              value={productData.code}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Similar inputs for category, type, brand, and description */}
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessMessage message="¡Producto actualizado exitosamente!" onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
};

export default ProductEditModal;
