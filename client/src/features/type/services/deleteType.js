import api from '../../../services/api'; // Asegúrate de usar tu instancia configurada de Axios

// Servicio para eliminar un tipo existente
export const deleteType = async (typeId) => {
  try {
    await api.delete(`/inventory/types/${typeId}/`);
    return { success: true, message: 'Tipo eliminado correctamente' };
  } catch (error) {
    console.error('Error al eliminar el tipo:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Error al eliminar el tipo.');
  }
};

export default deleteType;
