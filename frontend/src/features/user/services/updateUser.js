import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para actualizar los datos del perfil del usuario
export const updateUser = async (userData) => {
    try {
      const response = await api.put('users/profile/', userData);
      return response.data; // Devuelve los datos actualizados
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Error al actualizar el perfil del usuario');
    }
  };

  export default {
    updateUser
  };
  