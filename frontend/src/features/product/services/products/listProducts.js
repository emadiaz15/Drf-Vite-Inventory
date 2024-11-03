import api from '../../../../services/api'; // Importa la instancia de Axios configurada

// Método para listar todos los productos
export const listProducts = async () => {
  try {
    // Cambia el endpoint para que coincida con la configuración de Django
    const response = await api.get('/inventory/products/'); // Verifica que la URL esté configurada correctamente en el backend
    return response.data; // Devuelve los datos de la respuesta en caso de éxito
  } catch (error) {
    // Manejo mejorado de errores con mensajes detallados
    if (error.response) {
      console.error('Error al listar los productos:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
    throw error;
  }
};

// Exporta el servicio para facilitar la importación en otros archivos
export default {
  listProducts,
};
