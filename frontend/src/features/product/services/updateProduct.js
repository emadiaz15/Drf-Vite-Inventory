import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para actualizar un producto existente
export const updateProduct = async (productId, updateData) => {
    try {
      const response = await api.put(`/products/${productId}/`, updateData); // El token se agrega automáticamente
      return response.data; // Devuelve los datos actualizados del producto
    } catch (error) {
      console.error(`Error al actualizar el producto ${productId}:`, error.response?.data || error.message);
      throw error; // Lanzamos el error para manejarlo en el componente
    }
  };

// Exportamos todo el servicio para facilitar la importación en otros archivos
export default {
  updateProduct,
};