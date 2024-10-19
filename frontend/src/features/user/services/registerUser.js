import api from '../../../services/api'; // Usa la instancia de Axios configurada

// Método para el registro de usuarios
export const registerUser = async (userData) => {
  try {
    // Enviar la solicitud POST al endpoint de registro de usuarios
    const response = await api.post('/users/register/', {
      username: userData.username,
      email: userData.email,
      name: userData.name,
      last_name: userData.last_name,
      dni: userData.dni,
      image: userData.image || 'http://example.com', // Puedes manejar la URL de la imagen de manera dinámica
      is_active: userData.is_active,
      is_staff: userData.is_staff,
      password: userData.password
    });
    return response.data; // Devolver la respuesta correcta al frontend
  } catch (error) {
    // Verificar si el backend devuelve un mensaje detallado en 'error.response'
    if (error.response) {
      console.error('Error en el registro:', error.response.data);
      
      // Manejar errores detallados que pueden estar dentro de 'data'
      const detail = error.response.data.detail;
      const errorMessage = detail || 'Error en el registro de usuario';
      
      throw new Error(errorMessage); // Lanzar el error para manejarlo en el frontend
    } else {
      // Si no hay respuesta del servidor, mostrar el mensaje de error genérico
      console.error('Error en el registro:', error.message);
      throw new Error('Error en la conexión o en el servidor');
    }
  }
};

export default {
  registerUser
};
