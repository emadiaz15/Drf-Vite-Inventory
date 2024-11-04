// src/features/product/components/ProductEditModal.jsx
import React, { useState } from 'react';
import { updateProduct } from '../services/products/updateProduct';
import SuccessMessage from '../../../components/common/SuccessMessage';

const ProductEditModal = ({ product, onClose, onSave }) => {
  const [productData, setProductData] = useState({
    name: product.name,
    code: product.code,
    category: product.category ? product.category.id : '', // Asume que category es un objeto
    type: product.type ? product.type.id : '', // Asume que type es un objeto
    description: product.description || '',
    brand: product.brand ? product.brand.id : '', // Asume que brand es un objeto
    stock_quantity: product.stock ? product.stock.quantity : 0, // Si el stock es un objeto
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
      const updatedProduct = await updateProduct(product.id, productData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSave(updatedProduct); // Pasa el producto actualizado a ProductList
        onClose(); // Cierra el modal
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
          {/* Nombre */}
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
          
          {/* Código */}
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
          
          {/* Categoría */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          {/* Tipo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <input
              type="text"
              name="type"
              value={productData.type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
            ></textarea>
          </div>
          
          {/* Marca */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Cantidad de Stock */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cantidad de Stock</label>
            <input
              type="number"
              name="stock_quantity"
              value={productData.stock_quantity}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>

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
