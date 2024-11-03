import React, { useState, useEffect } from 'react';

const ProductDetail = () => {
  const { productId } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Aquí deberías hacer una solicitud para obtener las bobinas/rollos/contenedores del producto
    const fetchData = async () => {
      // Simulación de datos
      const data = Array.from({ length: 18 }, (_, index) => ({
        id: index + 1,
        name: `Item ${index + 1}`,
      }));
      setItems(data);
    };
    fetchData();
  }, [productId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Detalles del Producto {productId}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow hover:shadow-lg">
            <h3 className="font-semibold">{item.name}</h3>
            <p>Detalles adicionales aquí</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
