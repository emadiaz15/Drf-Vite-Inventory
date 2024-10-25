import api from '../../../../services/api'; // Usa la instancia de Axios configurada

// Método para listar todos los productos
export const listProducts = async () => {
  try {
    const response = await api.get('/products/list'); // Asegúrate de que la URL sea correcta
    return response.data;
  } catch (error) {
    console.error('Error al listar los productos:', error.response?.data || error.message);
    throw error; // Lanzamos el error para manejarlo en el componente
  }
};

// Exportamos todo el servicio para facilitar la importación en otros archivos
export default {
  listProducts
};