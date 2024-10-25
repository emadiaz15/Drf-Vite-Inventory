import React, { useState } from 'react';
import PasswordResetModal from '../edit/PasswordResetModal'; // Importa el nuevo modal

const UserEditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    dni: user.dni,
    is_active: user.is_active,
    is_staff: user.is_staff,
    password: '',
    confirmPassword: '',
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedUserData = { ...formData };

    // Si no se ingresó una nueva contraseña, eliminar el campo de los datos enviados
    if (!updatedUserData.password) {
      delete updatedUserData.password;
      delete updatedUserData.confirmPassword;
    }

    try {
      await onSave(user.id, updatedUserData); // Guardar cambios
    } catch (error) {
      // Mostrar mensajes de error si hay problemas al guardar el usuario
      setError(error.message || 'Error al actualizar el usuario');
    }
  };

  const handleRestorePassword = () => {
    setShowPasswordModal(true); // Abre el modal para cambiar la contraseña
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-md w-1/2">
          <h2 className="text-2xl mb-4">Editar Usuario</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Activo</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="is_staff"
                checked={formData.is_staff}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Administrador</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Repite Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Guardar
              </button>
              <button
                type="button"
                onClick={handleRestorePassword}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                Restaurar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para cambiar la contraseña */}
      {showPasswordModal && (
        <PasswordResetModal
          userId={user.id}
          onClose={() => setShowPasswordModal(false)}
          onSave={(newPassword) => handleSaveNewPassword(user.id, newPassword)}
        />
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-500 text-white p-4 rounded">
            {successMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default UserEditModal;
