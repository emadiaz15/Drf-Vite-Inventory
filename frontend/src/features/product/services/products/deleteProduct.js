import api from '../../../../services/api'; // Usa la instancia de Axios configurada

// Método para eliminar un producto
export const deleteProduct = async (productId) => {
    try {
      const response = await api.delete(`/inventory/products/${productId}/`); // El token se agrega automáticamente
      return response.data; // Devuelve los datos del producto eliminado
    } catch (error) {
      console.error(`Error al eliminar el producto ${productId}:`, error.response?.data || error.message);
      throw error; // Lanzamos el error para manejarlo en el componente
    }
  };

// Exportamos todo el servicio para facilitar la importación en otros archivos
export default {
    deleteProduct,
  };