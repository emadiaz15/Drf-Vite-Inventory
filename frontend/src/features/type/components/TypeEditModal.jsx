import React, { useState } from 'react';
import { updateType } from '../services/updateType'; // Importa el servicio para actualizar el tipo
import SuccessMessage from '../../../components/common/SuccessMessage'; // Mensaje de éxito opcional

const TypeEditModal = ({ type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: type.name || '',
    description: type.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateType(type.id, formData); // Llama al servicio para actualizar el tipo
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000); // Mostrar mensaje de éxito por 4 segundos
      onSave(); // Llamar a `onSave` para actualizar la lista
      onClose(); // Cerrar el modal después de actualizar
    } catch (error) {
      setError('No se pudo actualizar el tipo.');
      console.error('Error al actualizar el tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-2xl mb-4">Editar Tipo</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
        {showSuccess && <SuccessMessage message="¡Tipo actualizado con éxito!" onClose={() => setShowSuccess(false)} />}
      </div>
    </div>
  );
};

export default TypeEditModal;
