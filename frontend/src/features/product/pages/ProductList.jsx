import React from 'react';
import { useProducts } from '../hooks/useProducts'; // Usamos el hook de productos
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import ProductTable from '../components/ProductTable'; // Importa la tabla de productos
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ProductList = () => {
  const { products, error, loading } = useProducts(); // Obtenemos productos desde el hook

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 sm:p-10 mt-14">
          <div className="p-6 sm:p-10 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <h1 className="text-2xl font-semibold mb-4">Lista de Productos</h1>
            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : products.length > 0 ? (
              <ProductTable products={products} /> // Renderiza la tabla con productos
            ) : (
              <p>No hay productos disponibles</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
