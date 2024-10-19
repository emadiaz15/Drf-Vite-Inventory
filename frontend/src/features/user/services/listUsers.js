import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para listar usuarios con soporte para paginación
export const listUsers = async (url = '/users/list/') => {
  try {
    const response = await api.get(url); // Aquí pasamos la URL dinámica para manejar la paginación
    return response.data; // Devolvemos el objeto completo del backend con "results", "next", "previous"
  } catch (error) {
    console.error('Error al listar usuarios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al listar usuarios');
  }
};

export default {
  listUsers,
};