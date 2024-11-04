import React, { useState, useEffect } from 'react';
import { listProducts } from '../services/products/listProducts';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import Toolbar from '../../../components/common/Toolbar';
import Pagination from '../../../components/ui/Pagination'; // Importar Pagination
import ProductCreateModal from '../components/ProductCreateModal';
import ProductEditModal from '../components/ProductEditModal';
import Table from '../../../components/common/Table';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
        setFilteredProducts(response.results);
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

  // Definimos los encabezados de la tabla
  const headers = [
    'Código',
    'Tipo',
    'Nombre del Producto',
    'Categoría',
    'Stock',
    'Acciones',
  ];

  // Formateamos los productos para adaptarlos al componente TableRow
  const rows = filteredProducts.map((product) => ({
    id: product.id,
    code: product.code,
    type: product.type ? { value: product.type.name } : { value: 'Sin Tipo' },
    name: product.name,
    brand: product.brand ? { value: product.brand.name } : { value: 'Sin Marca' },
    category: product.category ? { value: product.category.name } : { value: 'Sin Categoría' },
    stock: product.stock ? { value: product.stock.quantity } : { value: 'No Disponible' },
  }));

  // Definimos las acciones para cada fila
  const actions = [
    {
      label: 'Editar',
      onClick: (id) => handleEditProduct(products.find((p) => p.id === id)),
      className: 'bg-blue-500 text-white',
      hoverClass: 'bg-blue-600',
    },
    {
      label: 'Eliminar',
      onClick: handleDeleteProduct,
      className: 'bg-red-500 text-white',
      hoverClass: 'bg-red-600',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 mt-14 rounded-lg">
          <div className="p-2 border-gray-200 rounded-lg dark:border-gray-700">
            <Toolbar onSearch={handleSearch} onCreate={handleCreateProduct} createButtonText="Nuevo Producto" />

            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Table headers={headers} rows={rows} actions={actions} />
            )}

            {/* Usamos el componente Pagination */}
            <Pagination
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              hasNext={!!nextPage}
              hasPrevious={!!previousPage}
            />
          </div>
        </div>
      </div>

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
