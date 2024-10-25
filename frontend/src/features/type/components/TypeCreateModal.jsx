import React, { useState } from 'react';
import { createType } from '../services/createType'; // Importa el servicio para crear un tipo
import SuccessMessage from '../../../components/common/SuccessMessage'; // Mensaje de éxito opcional

const TypeCreateModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
      await createType(formData); // Llama al servicio para crear el tipo
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000); // Mostrar mensaje de éxito por 4 segundos
      onSave(); // Llamar a `onSave` para actualizar la lista
      onClose(); // Cerrar el modal después de crear
    } catch (error) {
      setError('No se pudo crear el tipo.');
      console.error('Error al crear el tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-2xl mb-4">Crear Nuevo Tipo</h2>
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
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
        {showSuccess && <SuccessMessage message="¡Tipo creado con éxito!" onClose={() => setShowSuccess(false)} />}
      </div>
    </div>
  );
};

export default TypeCreateModal;
