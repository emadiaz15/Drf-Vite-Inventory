import React, { useState, useEffect } from 'react';
import { listProducts } from '../services/products/listProducts';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import ProductToolbar from '../components/ProductToolbar'; // Importar ProductToolbar
import ProductCreateModal from '../components/ProductCreateModal';
import ProductEditModal from '../components/ProductEditModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados por búsqueda
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (url = null) => {
    try {
      const response = await listProducts(url);
      
      if (response && response.results) {
        setProducts(response.results);
        setFilteredProducts(response.results); // Inicializar productos filtrados
        setNextPage(response.next);
        setPreviousPage(response.previous);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        console.error('Respuesta inesperada al obtener productos:', response);
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setError('Error al obtener los productos.');
    }
  };

  const handleSearch = (query) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    console.log(`Eliminar producto con ID ${productId}`);
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchProducts(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchProducts(previousPage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 mt-14 rounded-lg">
          <div className="p-2 border-gray-200 rounded-lg dark:border-gray-700">

            {/* Integrar ProductToolbar */}
            <ProductToolbar onSearch={handleSearch} onCreate={handleCreateProduct} />

            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
                    <tr>
                      <th className="px-6 py-3">Código</th>
                      <th className="px-6 py-3">Tipo</th>
                      <th className="px-6 py-3">Nombre del Producto</th>
                      <th className="px-6 py-3">Categoría</th>
                      <th className="px-6 py-3">Stock</th>
                      <th className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      product && product.name ? (
                        <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4">{product.code}</td>
                          <td className="px-6 py-4">{product.type ? product.type.name : 'Sin Tipo'}</td>
                          <td className="px-6 py-4">{product.name}</td>
                          <td className="px-6 py-4">{product.brand ? product.brand.name : 'Sin Marca'}</td>
                          <td className="px-6 py-4">{product.category ? product.category.name : 'Sin Categoría'}</td>
                          <td className="px-6 py-4">{product.stock ? product.stock.quantity : 'No Disponible'}</td>
                          <td className="px-6 py-4 space-x-2">
                            <button 
                              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                              onClick={() => handleEditProduct(product)}
                            >
                              Editar
                            </button>
                            <button 
                              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ) : null
                    ))}
                  </tbody>
                </table>

                {/* Controles de Paginación */}
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    onClick={handlePreviousPage}
                    disabled={!previousPage}
                  >
                    Anterior
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    onClick={handleNextPage}
                    disabled={!nextPage}
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && <ProductCreateModal onClose={() => setShowCreateModal(false)} />}
      {showEditModal && (
        <ProductEditModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onSave={fetchProducts}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
