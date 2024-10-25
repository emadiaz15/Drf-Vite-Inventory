import api from '../../../services/api'; // Asegúrate de usar tu instancia configurada de Axios

// Servicio para obtener la lista de tipos
export const listTypes = async () => {
  try {
    const response = await api.get('/products/types/');
    return response.data; // Devuelve la lista de tipos
  } catch (error) {
    console.error('Error al obtener la lista de tipos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al obtener la lista de tipos.');
  }
};

export default listTypes;
